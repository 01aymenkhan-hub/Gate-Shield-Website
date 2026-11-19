import nextEnv from '@next/env';
import nodemailer from 'nodemailer';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

function stripQuotes(val) {
  const trimmed = String(val ?? '').trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function validateAndResolveEnv() {
  const issues = [];
  const emailEnabledRaw = String(process.env.EMAIL_ENABLED ?? 'true')
    .trim()
    .toLowerCase();
  if (emailEnabledRaw === 'false') {
    issues.push('EMAIL_ENABLED is set to false.');
  }

  const host = stripQuotes(process.env.SMTP_HOST || '');
  if (!host) {
    issues.push('SMTP_HOST is missing (expected smtp.gmail.com).');
  } else if (host.includes('@')) {
    issues.push(
      `SMTP_HOST looks like an email address ("${host}") instead of "smtp.gmail.com".`
    );
  }

  const parsedPort = Number.parseInt(String(process.env.SMTP_PORT || '587'), 10);
  const port = Number.isFinite(parsedPort) ? parsedPort : 587;
  if (port !== 587) {
    issues.push(`SMTP_PORT is ${port} (expected 587 for Gmail STARTTLS).`);
  }

  const secureEnv = String(process.env.SMTP_SECURE || 'false')
    .trim()
    .toLowerCase();
  if (port === 587 && secureEnv === 'true') {
    issues.push(
      'SMTP_SECURE=true conflicts with port 587 STARTTLS (must be SMTP_SECURE=false).'
    );
  }

  const user = stripQuotes(process.env.SMTP_USER || '').toLowerCase();
  const rawPass = stripQuotes(process.env.SMTP_PASSWORD || '');
  const pass = host.toLowerCase().includes('gmail.com')
    ? rawPass.replace(/\s+/g, '')
    : rawPass.trim();

  if (!user || !EMAIL_REGEX.test(user)) {
    issues.push('SMTP_USER is missing or invalid.');
  }
  if (!pass) {
    issues.push('SMTP_PASSWORD is missing.');
  } else if (host.toLowerCase().includes('gmail.com') && pass.length !== 16) {
    issues.push(
      `SMTP_PASSWORD normalized length is ${pass.length} characters (Google App Passwords are typically 16 characters).`
    );
  }

  const fromEmail = stripQuotes(
    process.env.SMTP_FROM_EMAIL || user
  ).toLowerCase();
  const fromName = stripQuotes(process.env.SMTP_FROM_NAME || 'GateShield');
  const recipientEmail = stripQuotes(
    process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.CONTACT_RECIPIENT_EMAIL ||
      user
  ).toLowerCase();

  if (!fromEmail || !EMAIL_REGEX.test(fromEmail)) {
    issues.push('SMTP_FROM_EMAIL is missing or invalid.');
  }
  if (!recipientEmail || !EMAIL_REGEX.test(recipientEmail)) {
    issues.push(
      'ADMIN_NOTIFICATION_EMAIL / CONTACT_RECIPIENT_EMAIL is missing or invalid.'
    );
  }

  return {
    issues,
    config: {
      host,
      port,
      secure: false,
      requireTLS: true,
      user,
      pass,
      fromEmail,
      fromName,
      recipientEmail,
    },
  };
}

async function main() {
  const sendTest =
    process.argv.includes('--send-test') ||
    process.env.SEND_TEST_EMAIL === '1';

  const { issues, config } = validateAndResolveEnv();

  console.log('=== GateShield Landing Page Gmail SMTP Verification ===');
  console.log(`Host:           ${config.host}`);
  console.log(`Port:           ${config.port}`);
  console.log(`Security:       STARTTLS (secure=${config.secure}, requireTLS=${config.requireTLS})`);
  console.log(`Username:       ${config.user}`);
  console.log(`Password:       ${config.pass ? `<CONFIGURED (${config.pass.length} chars)>` : '<MISSING>'}`);
  console.log(`Sender:         ${config.fromName} <${config.fromEmail}>`);
  console.log(`Recipient:      ${config.recipientEmail}`);

  if (issues.length > 0) {
    console.error('\nConfiguration issues detected:');
    for (const issue of issues) {
      console.error(` - ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    console.log('\n[1/2] Verifying STARTTLS connection and Gmail authentication...');
    await transporter.verify();
    console.log('PASS: Authenticated Gmail STARTTLS connection established.');

    if (sendTest) {
      console.log(
        `\n[2/2] Sending verification test email to ${config.recipientEmail}...`
      );
      const nowIso = new Date().toISOString();
      const info = await transporter.sendMail({
        from: { name: config.fromName, address: config.fromEmail },
        to: config.recipientEmail,
        replyTo: { name: config.fromName, address: config.fromEmail },
        subject: '[GateShield Website] Gmail SMTP STARTTLS Verification Test',
        html: `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;"><div style="background:#354F96;color:#fff;padding:20px 24px;"><h2 style="margin:0;font-size:18px;">GateShield Website SMTP Test</h2></div><div style="padding:20px 24px;color:#0f172a;font-size:14px;line-height:1.6;"><p>This automated message confirms Gmail SMTP STARTTLS authentication on port 587 succeeded.</p><p><strong>Timestamp (UTC):</strong> ${nowIso}</p></div></div>`,
        text: `GateShield Website SMTP Verification Test\nTimestamp (UTC): ${nowIso}\nGmail SMTP STARTTLS authentication on port 587 succeeded.`,
      });
      console.log('PASS: Test email accepted by Gmail SMTP.');
      console.log('  Message ID:', info.messageId);
      console.log('  Accepted:  ', info.accepted);
      console.log('  Rejected:  ', info.rejected);
      console.log('  Response:  ', info.response);
    }
  } catch (err) {
    const code = String(err?.code || '');
    const responseCode = Number(err?.responseCode || 0);
    console.error(
      `\nFAIL: SMTP verification failed (${code || 'ERROR'}${responseCode ? ` / ${responseCode}` : ''}).`
    );

    if (code === 'EAUTH' || responseCode === 535) {
      console.error(
        'Diagnosis: Google rejected the SMTP_USER / App Password combination (535 5.7.8).'
      );
      console.error(
        'Check in Google Account for ' +
          config.user +
          ': 1) 2-Step Verification is enabled, 2) App Password was generated for this exact Gmail account without typos, and 3) App Password has not been revoked.'
      );
    } else if (code === 'ETLS') {
      console.error('Diagnosis: STARTTLS upgrade failed with the mail server.');
    } else {
      console.error('Diagnosis:', err instanceof Error ? err.message : String(err));
    }
    process.exitCode = 1;
  } finally {
    transporter.close();
  }
}

main();
