import { escapeHtml, type SanitizedContactPayload } from './contactValidation';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

interface EmailShellParams {
  title: string;
  heading: string;
  bodyHtml: string;
}

interface SummaryRow {
  label: string;
  valueHtml: string;
}

export const NOTIFICATION_EMAIL_SUBJECT = 'New Website Inquiry – GateShield';
export const EMAIL_FOOTER_TEXT = 'This email was sent automatically by GateShield.';

/** Format submission date and time clearly in PKT and UTC. */
function formatSubmissionTimestamp(date: Date): {
  pktFormatted: string;
  utcIso: string;
} {
  const pktFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return {
    pktFormatted: `${pktFormatted} (PKT)`,
    utcIso: date.toISOString(),
  };
}

/** Shared minimal, responsive HTML layout for GateShield emails (#354F96). */
function renderEmailShell({
  title,
  heading,
  bodyHtml,
}: EmailShellParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111513;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f5f7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(17,21,19,0.06);">
          <tr>
            <td style="background-color:#354F96;padding:24px 28px;">
              <div style="color:rgba(255,255,255,0.85);font-size:13px;font-weight:700;letter-spacing:0.04em;margin-bottom:6px;">
                GateShield
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.3;font-weight:700;">
                ${escapeHtml(heading)}
              </h1>
            </td>
          </tr>
          ${bodyHtml}
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;font-size:12px;color:#64748b;line-height:1.5;">
              ${escapeHtml(EMAIL_FOOTER_TEXT)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Shared table renderer for clean, responsive key-value details. */
function renderDetailsRows(rows: SummaryRow[]): string {
  return rows
    .map((row, idx) => {
      const borderStyle =
        idx < rows.length - 1 ? 'border-bottom:1px solid #e2e8f0;' : '';
      return `<tr>
  <td style="padding:12px 14px;${borderStyle}width:36%;font-size:13px;font-weight:600;color:#475569;background-color:#f8fafc;">
    ${escapeHtml(row.label)}
  </td>
  <td style="padding:12px 14px;${borderStyle}font-size:14px;color:#0f172a;">
    ${row.valueHtml}
  </td>
</tr>`;
    })
    .join('\n');
}

/**
 * Build the minimal, GateShield-branded internal inquiry notification email (#354F96).
 * Includes submitted details, optional message (when provided), and the "Reply to [Name]" CTA.
 * Contains zero CTA, button, module, or source attribution labels.
 */
export function buildContactNotificationEmail(
  data: SanitizedContactPayload,
  submittedAt: Date
): RenderedEmail {
  const { pktFormatted, utcIso } = formatSubmissionTimestamp(submittedAt);

  const safeFullName = escapeHtml(data.fullName);
  const safeCompany = escapeHtml(data.company);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safePhoneHref = encodeURIComponent(data.phone.replace(/\s+/g, ''));
  const safeFacilityType = escapeHtml(data.facilityType);
  const replyLabel = data.fullName ? `Reply to ${safeFullName}` : 'Reply to Visitor';

  const detailRows = renderDetailsRows([
    { label: 'Full Name', valueHtml: `<strong>${safeFullName}</strong>` },
    { label: 'Company / Facility', valueHtml: safeCompany },
    {
      label: 'Work Email',
      valueHtml: `<a href="mailto:${safeEmail}" style="color:#354F96;text-decoration:underline;font-weight:600;">${safeEmail}</a>`,
    },
    {
      label: 'Phone / WhatsApp',
      valueHtml: `<a href="tel:${safePhoneHref}" style="color:#0f172a;text-decoration:none;font-weight:600;">${safePhone}</a>`,
    },
    ...(data.facilityType
      ? [{ label: 'Facility Type', valueHtml: safeFacilityType }]
      : []),
    {
      label: 'Submitted On',
      valueHtml: `${escapeHtml(pktFormatted)} <span style="color:#64748b;font-size:12px;">(${escapeHtml(utcIso)})</span>`,
    },
  ]);

  const messageSectionHtml = data.message
    ? `<tr>
        <td style="padding:16px 28px 8px 28px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;margin-bottom:8px;">
            Message / Special Requirements
          </div>
          <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #354F96;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.6;color:#1e293b;">
            ${escapeHtml(data.message).replace(/\n/g, '<br />')}
          </div>
        </td>
      </tr>`
    : '';

  const bodyHtml = `
          <tr>
            <td style="padding:24px 28px 8px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;">
                ${detailRows}
              </table>
            </td>
          </tr>
          ${messageSectionHtml}
          <tr>
            <td style="padding:20px 28px 28px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius:999px;background-color:#354F96;">
                    <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${NOTIFICATION_EMAIL_SUBJECT}`)}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                      ${replyLabel}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

  const html = renderEmailShell({
    title: NOTIFICATION_EMAIL_SUBJECT,
    heading: 'New Website Inquiry',
    bodyHtml,
  });

  const text = [
    'GateShield — New Website Inquiry',
    '================================',
    `Full Name:          ${data.fullName}`,
    `Company / Facility: ${data.company}`,
    `Work Email:         ${data.email}`,
    `Phone / WhatsApp:   ${data.phone}`,
    ...(data.facilityType ? [`Facility Type:      ${data.facilityType}`] : []),
    `Submitted On:       ${pktFormatted} (${utcIso})`,
    ...(data.message
      ? ['', 'Message / Special Requirements:', data.message]
      : []),
    '',
    EMAIL_FOOTER_TEXT,
  ].join('\n');

  return {
    subject: NOTIFICATION_EMAIL_SUBJECT,
    html,
    text,
  };
}

/**
 * Build the minimal, GateShield-branded visitor confirmation email (#354F96).
 * Contains zero CTA, button, module, or source attribution labels.
 */
export function buildVisitorConfirmationEmail(
  data: SanitizedContactPayload,
  submittedAt: Date
): RenderedEmail {
  const { pktFormatted } = formatSubmissionTimestamp(submittedAt);
  const subject = 'Thank You for Contacting GateShield';

  const safeFullName = escapeHtml(data.fullName);
  const safeCompany = escapeHtml(data.company);
  const safePhone = escapeHtml(data.phone);
  const safeFacilityType = escapeHtml(data.facilityType);

  const summaryRows: SummaryRow[] = [
    { label: 'Company / Facility', valueHtml: safeCompany },
    { label: 'Phone / WhatsApp', valueHtml: safePhone },
    ...(data.facilityType
      ? [{ label: 'Facility Type', valueHtml: safeFacilityType }]
      : []),
    { label: 'Submitted On', valueHtml: escapeHtml(pktFormatted) },
  ];

  const optionalNotesHtml = data.message
    ? `<tr>
        <td style="padding:12px 28px 8px 28px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;margin-bottom:8px;">
            Message / Special Requirements
          </div>
          <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #354F96;border-radius:8px;padding:12px 14px;font-size:13px;line-height:1.6;color:#334155;">
            ${escapeHtml(data.message).replace(/\n/g, '<br />')}
          </div>
        </td>
      </tr>`
    : '';

  const bodyHtml = `
          <tr>
            <td style="padding:24px 28px 8px 28px;">
              <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#0f172a;">
                Hi <strong>${safeFullName}</strong>,
              </p>
              <p style="margin:0;font-size:14px;line-height:1.65;color:#334155;">
                Thank you for contacting GateShield. We have received your inquiry and our team will contact you shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;">
                ${renderDetailsRows(summaryRows)}
              </table>
            </td>
          </tr>
          ${optionalNotesHtml}
          <tr>
            <td style="padding:16px 28px 24px 28px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                If you would like to add more details, simply reply to this email.
              </p>
            </td>
          </tr>`;

  const html = renderEmailShell({
    title: subject,
    heading: 'Inquiry Received',
    bodyHtml,
  });

  const text = [
    `Hi ${data.fullName},`,
    '',
    'Thank you for contacting GateShield. We have received your inquiry and our team will contact you shortly.',
    '',
    `Company / Facility: ${data.company}`,
    `Phone / WhatsApp:   ${data.phone}`,
    ...(data.facilityType ? [`Facility Type:      ${data.facilityType}`] : []),
    `Submitted On:       ${pktFormatted}`,
    ...(data.message
      ? ['', 'Message / Special Requirements:', data.message]
      : []),
    '',
    EMAIL_FOOTER_TEXT,
  ].join('\n');

  return { subject, html, text };
}
