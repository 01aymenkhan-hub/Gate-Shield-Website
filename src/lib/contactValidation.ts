/**
 * Validation and sanitization utilities for GateShield landing page contact forms.
 * Captures only actual visitor-submitted fields (no CTA/button/source attribution).
 */

export interface SanitizedContactPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  facilityType: string;
  message: string;
  submissionId: string;
}

export type ValidationResult =
  | { ok: true; data: SanitizedContactPayload }
  | {
      ok: false;
      status: number;
      error: string;
      fieldErrors?: Record<string, string>;
    };

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
const RESERVED_INVALID_SUFFIXES = [
  '.invalid',
  '.local',
  '.localhost',
  '.internal',
  '.test',
];
const PHONE_ALLOWED_REGEX = /^[+\d\s().-]+$/;
const URL_REGEX = /https?:\/\/\S+/gi;

/** Validate email address syntax and reject reserved non-deliverable hostnames. */
export function isValidEmailAddress(email: string): boolean {
  if (!email || email.length > 254 || email.includes('..')) return false;
  if (!EMAIL_REGEX.test(email)) return false;

  const atIndex = email.lastIndexOf('@');
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1).toLowerCase();

  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.')) {
    return false;
  }
  if (RESERVED_INVALID_SUFFIXES.some((suffix) => domain.endsWith(suffix))) {
    return false;
  }

  const labels = domain.split('.');
  const tld = labels[labels.length - 1];
  if (!tld || tld.length < 2 || /^\d+$/.test(tld)) return false;

  return labels.every(
    (label) => label.length > 0 && !label.startsWith('-') && !label.endsWith('-')
  );
}

/** Strip CR/LF and ASCII control characters to prevent header injection. */
export function stripHeaderChars(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Sanitize multiline text fields while preserving clean line breaks. */
export function sanitizeMultiline(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

/** Escape HTML special characters before interpolating user data into email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Validate and sanitize raw request body from any landing page contact form. */
export function validateContactSubmission(rawBody: unknown): ValidationResult {
  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return {
      ok: false,
      status: 400,
      error: 'Invalid request payload.',
    };
  }

  const body = rawBody as Record<string, unknown>;

  // Honeypot trap: bots commonly fill hidden fields like "website"
  const honeypot = stripHeaderChars(body.website, 100);
  if (honeypot.length > 0) {
    return {
      ok: false,
      status: 400,
      error: 'Unable to process your submission. Please try again.',
    };
  }

  // Timing check: reject automated instant submits (< 800ms after form mount/open)
  if (typeof body.formLoadedAt === 'number' && Number.isFinite(body.formLoadedAt)) {
    const elapsedMs = Date.now() - body.formLoadedAt;
    if (elapsedMs >= 0 && elapsedMs < 800) {
      return {
        ok: false,
        status: 400,
        error: 'Please take a moment before submitting your request.',
      };
    }
  }

  const fullName = stripHeaderChars(body.fullName, 120);
  const company = stripHeaderChars(body.company, 150);
  const email = stripHeaderChars(body.email, 254).toLowerCase();
  const phone = stripHeaderChars(body.phone, 30);
  const facilityType =
    stripHeaderChars(body.facilityType, 100) || 'Corporate Office';
  const message = sanitizeMultiline(body.message, 2000);
  const rawSubmissionId = stripHeaderChars(body.submissionId, 100);
  const submissionId = rawSubmissionId.replace(/[^a-zA-Z0-9_-]/g, '');

  const fieldErrors: Record<string, string> = {};

  if (!fullName || fullName.length < 2) {
    fieldErrors.fullName = 'Full name is required (at least 2 characters).';
  }

  if (!company || company.length < 2) {
    fieldErrors.company = 'Company / Facility name is required.';
  }

  if (!email || !isValidEmailAddress(email)) {
    fieldErrors.email = 'Please enter a valid work email address.';
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (
    !phone ||
    !PHONE_ALLOWED_REGEX.test(phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 20
  ) {
    fieldErrors.phone = 'Please enter a valid phone or WhatsApp number.';
  }

  // Reject obvious link spam inside optional message
  const urlsInMessage = message.match(URL_REGEX);
  if (urlsInMessage && urlsInMessage.length > 4) {
    fieldErrors.form =
      'Your message contains too many links. Please remove extra URLs.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      error:
        fieldErrors.form ||
        Object.values(fieldErrors)[0] ||
        'Please review the highlighted fields and try again.',
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      company,
      email,
      phone,
      facilityType,
      message,
      submissionId,
    },
  };
}
