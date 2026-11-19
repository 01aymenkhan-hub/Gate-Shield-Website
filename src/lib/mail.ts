import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import {
  isValidEmailAddress,
  stripHeaderChars,
  type SanitizedContactPayload,
} from './contactValidation';
import {
  buildContactNotificationEmail,
  buildVisitorConfirmationEmail,
} from './emailTemplate';

/**
 * Centralized server-side Gmail SMTP transporter and email dispatcher
 * exclusively for GateShield public landing page forms.
 */

export class SmtpConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SmtpConfigurationError';
  }
}

export interface SmtpRuntimeConfig {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  recipientEmail: string;
}

export type VisitorDomainDeliverability =
  | { deliverable: true; verifiedVia: 'mx' | 'a_fallback' }
  | { deliverable: false; reason: 'invalid_syntax' | 'null_mx' | 'domain_not_found' }
  | { deliverable: 'unverified'; reason: 'dns_timeout' };

export interface SmtpVerificationResult {
  ok: boolean;
  host?: string;
  port?: number;
  secure?: boolean;
  requireTLS?: boolean;
  user?: string;
  fromEmail?: string;
  recipientEmail?: string;
  errorCategory?:
    | 'configuration_error'
    | 'auth_failed'
    | 'tls_failed'
    | 'connection_failed';
  safeMessage: string;
}

export interface SendLandingEmailsOptions {
  skipNotification?: boolean;
  skipConfirmation?: boolean;
  visitorDeliverability?: VisitorDomainDeliverability;
}

export interface SendLandingEmailsResult {
  notificationSent: boolean;
  notificationMessageId?: string;
  confirmationSent: boolean;
  confirmationMessageId?: string;
  confirmationSkippedReason?: string;
}

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Resolve Gmail SMTP configuration exclusively from server environment variables.
 * Enforces STARTTLS (`secure: false`, `requireTLS: true`) on port 587.
 */
export function resolveSmtpConfig(): SmtpRuntimeConfig {
  const emailEnabledRaw = process.env.EMAIL_ENABLED?.trim().toLowerCase();
  if (emailEnabledRaw === 'false') {
    throw new SmtpConfigurationError(
      'Landing page email service is disabled (EMAIL_ENABLED=false).'
    );
  }

  const host = stripHeaderChars(process.env.SMTP_HOST || 'smtp.gmail.com', 255);
  if (!host || host.includes('@')) {
    throw new SmtpConfigurationError(
      'Invalid SMTP_HOST configuration (expected smtp.gmail.com).'
    );
  }

  const parsedPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const port =
    Number.isFinite(parsedPort) && parsedPort > 0 && parsedPort <= 65535
      ? parsedPort
      : 587;

  // Never use implicit SSL on port 587 — always enforce STARTTLS on port 587
  const secure = port === 587 ? false : process.env.SMTP_SECURE === 'true';
  const requireTLS =
    port === 587 ? true : process.env.SMTP_REQUIRE_TLS !== 'false';

  const user = stripHeaderChars(process.env.SMTP_USER, 254).toLowerCase();
  const rawPass =
    typeof process.env.SMTP_PASSWORD === 'string'
      ? stripWrappingQuotes(process.env.SMTP_PASSWORD)
      : '';
  // Gmail App Passwords are often pasted in 4-char space-separated groups; normalize safely for Gmail hosts
  const pass = host.toLowerCase().includes('gmail.com')
    ? rawPass.replace(/\s+/g, '')
    : rawPass.trim();

  const fromEmail = stripHeaderChars(
    process.env.SMTP_FROM_EMAIL || user,
    254
  ).toLowerCase();
  const fromName = stripHeaderChars(
    process.env.SMTP_FROM_NAME || 'GateShield',
    120
  );
  const recipientEmail = stripHeaderChars(
    process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.CONTACT_RECIPIENT_EMAIL ||
      user,
    254
  ).toLowerCase();

  if (!user || !pass) {
    throw new SmtpConfigurationError(
      'Missing SMTP_USER or SMTP_PASSWORD environment variable.'
    );
  }

  if (!isValidEmailAddress(user)) {
    throw new SmtpConfigurationError('Invalid SMTP_USER email format.');
  }

  if (!fromEmail || !isValidEmailAddress(fromEmail)) {
    throw new SmtpConfigurationError('Invalid or missing SMTP_FROM_EMAIL.');
  }

  if (!recipientEmail || !isValidEmailAddress(recipientEmail)) {
    throw new SmtpConfigurationError(
      'Invalid or missing ADMIN_NOTIFICATION_EMAIL / CONTACT_RECIPIENT_EMAIL.'
    );
  }

  return {
    host,
    port,
    secure,
    requireTLS,
    user,
    pass,
    fromEmail,
    fromName,
    recipientEmail,
  };
}

/** Create one Nodemailer transport configured for Gmail STARTTLS on port 587. */
export function createSmtpTransporter(config: SmtpRuntimeConfig) {
  return nodemailer.createTransport({
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
}

/** Classify SMTP failures safely without leaking passwords or sensitive server secrets. */
export function classifySmtpError(err: unknown): {
  category: 'auth_failed' | 'tls_failed' | 'connection_failed';
  safeSummary: string;
} {
  const errObj = err as { code?: string; responseCode?: number; message?: string };
  const code = String(errObj?.code || '').toUpperCase();
  const responseCode = Number(errObj?.responseCode || 0);
  const msg = String(errObj?.message || '');

  if (code === 'EAUTH' || responseCode === 535 || /BadCredentials|Invalid login/i.test(msg)) {
    return {
      category: 'auth_failed',
      safeSummary:
        'Gmail SMTP rejected the configured username or App Password (535 authentication failed).',
    };
  }

  if (code === 'ETLS' || /STARTTLS|TLS|certificate|SSL/i.test(msg)) {
    return {
      category: 'tls_failed',
      safeSummary: 'SMTP STARTTLS negotiation failed.',
    };
  }

  return {
    category: 'connection_failed',
    safeSummary: 'Unable to reach or complete transaction with SMTP server.',
  };
}

/**
 * Verify all required environment variables, STARTTLS setup, and live Gmail authentication
 * without printing or returning any password.
 */
export async function verifySmtpConnection(): Promise<SmtpVerificationResult> {
  let config: SmtpRuntimeConfig;
  try {
    config = resolveSmtpConfig();
  } catch (err) {
    return {
      ok: false,
      errorCategory: 'configuration_error',
      safeMessage:
        err instanceof Error ? err.message : 'Invalid SMTP configuration.',
    };
  }

  const transporter = createSmtpTransporter(config);
  try {
    await transporter.verify();
    return {
      ok: true,
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: config.requireTLS,
      user: config.user,
      fromEmail: config.fromEmail,
      recipientEmail: config.recipientEmail,
      safeMessage: `Authenticated STARTTLS connection verified with ${config.host}:${config.port}.`,
    };
  } catch (err) {
    const classified = classifySmtpError(err);
    return {
      ok: false,
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: config.requireTLS,
      user: config.user,
      fromEmail: config.fromEmail,
      recipientEmail: config.recipientEmail,
      errorCategory: classified.category,
      safeMessage: classified.safeSummary,
    };
  } finally {
    transporter.close();
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          const timeoutErr = new Error('DNS lookup timed out') as Error & {
            code?: string;
          };
          timeoutErr.code = 'ETIMEOUT';
          reject(timeoutErr);
        }, ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Verify a visitor email's mail domain via DNS MX (and RFC 5321 A/AAAA fallback)
 * before attempting confirmation mail delivery.
 */
export async function verifyVisitorEmailDomain(
  email: string
): Promise<VisitorDomainDeliverability> {
  if (!isValidEmailAddress(email)) {
    return { deliverable: false, reason: 'invalid_syntax' };
  }

  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();

  try {
    const mxRecords = await withTimeout(dns.resolveMx(domain), 3500);
    if (mxRecords.length > 0) {
      const hasValidMx = mxRecords.some(
        (rec) => rec.exchange && rec.exchange.trim() !== '.'
      );
      if (hasValidMx) {
        return { deliverable: true, verifiedVia: 'mx' };
      }
      return { deliverable: false, reason: 'null_mx' };
    }
  } catch (err) {
    const code = String((err as { code?: string })?.code || '');
    if (code === 'ENOTFOUND') {
      return { deliverable: false, reason: 'domain_not_found' };
    }
    if (code === 'ETIMEOUT' || code === 'EAI_AGAIN') {
      return { deliverable: 'unverified', reason: 'dns_timeout' };
    }
  }

  try {
    const addresses = await withTimeout(dns.resolve4(domain), 2500);
    if (addresses.length > 0) {
      return { deliverable: true, verifiedVia: 'a_fallback' };
    }
  } catch (err) {
    const code = String((err as { code?: string })?.code || '');
    if (code === 'ENOTFOUND') {
      return { deliverable: false, reason: 'domain_not_found' };
    }
    if (code === 'ETIMEOUT' || code === 'EAI_AGAIN') {
      return { deliverable: 'unverified', reason: 'dns_timeout' };
    }
  }

  return { deliverable: false, reason: 'domain_not_found' };
}

/**
 * Send landing page notification email to the configured GateShield recipient
 * and, once notification succeeds and recipient is verified deliverable,
 * send a confirmation email to the visitor using the same transporter.
 */
export async function sendLandingContactEmails(
  data: SanitizedContactPayload,
  submittedAt = new Date(),
  options: SendLandingEmailsOptions = {}
): Promise<SendLandingEmailsResult> {
  const config = resolveSmtpConfig();
  const transporter = createSmtpTransporter(config);

  let notificationSent = Boolean(options.skipNotification);
  let notificationMessageId: string | undefined;
  let confirmationSent = Boolean(options.skipConfirmation);
  let confirmationMessageId: string | undefined;
  let confirmationSkippedReason: string | undefined;

  try {
    if (!options.skipNotification) {
      const notificationEmail = buildContactNotificationEmail(data, submittedAt);
      const notifyInfo = await transporter.sendMail({
        from: {
          name: config.fromName,
          address: config.fromEmail,
        },
        to: config.recipientEmail,
        replyTo: {
          name: data.fullName,
          address: data.email,
        },
        subject: notificationEmail.subject,
        html: notificationEmail.html,
        text: notificationEmail.text,
      });

      if (!notifyInfo.accepted || notifyInfo.accepted.length === 0) {
        throw new Error('Notification recipient was not accepted by SMTP server.');
      }

      notificationSent = true;
      notificationMessageId = notifyInfo.messageId;
    }

    if (!options.skipConfirmation) {
      const domainCheck =
        options.visitorDeliverability ??
        (await verifyVisitorEmailDomain(data.email));

      if (domainCheck.deliverable !== true) {
        confirmationSkippedReason = domainCheck.reason;
      } else {
        try {
          const confirmationEmail = buildVisitorConfirmationEmail(
            data,
            submittedAt
          );
          const confirmInfo = await transporter.sendMail({
            from: {
              name: config.fromName,
              address: config.fromEmail,
            },
            to: {
              name: data.fullName,
              address: data.email,
            },
            replyTo: {
              name: config.fromName,
              address: config.recipientEmail,
            },
            subject: confirmationEmail.subject,
            html: confirmationEmail.html,
            text: confirmationEmail.text,
          });

          if (confirmInfo.accepted && confirmInfo.accepted.length > 0) {
            confirmationSent = true;
            confirmationMessageId = confirmInfo.messageId;
          } else {
            confirmationSkippedReason = 'smtp_recipient_not_accepted';
          }
        } catch (confirmErr) {
          const classified = classifySmtpError(confirmErr);
          console.warn(
            `[ContactMailer] Notification delivered, but confirmation email skipped (${classified.category}).`
          );
          confirmationSkippedReason = classified.category;
        }
      }
    }

    return {
      notificationSent,
      notificationMessageId,
      confirmationSent,
      confirmationMessageId,
      confirmationSkippedReason,
    };
  } finally {
    transporter.close();
  }
}
