import { NextRequest, NextResponse } from 'next/server';
import { validateContactSubmission } from '@/lib/contactValidation';
import {
  findOrCreateInquiry,
  updateInquiryEmailStatus,
} from '@/lib/leadsDb';
import {
  classifySmtpError,
  sendLandingContactEmails,
  SmtpConfigurationError,
  verifyVisitorEmailDomain,
} from '@/lib/mail';
import {
  acquireInFlightLock,
  checkEmailRateLimit,
  checkIpRateLimit,
  createSubmissionFingerprint,
  releaseInFlightLock,
} from '@/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32 * 1024; // 32 KB limit for contact form payloads

function extractClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown';
}

/**
 * POST /api/contact
 * 1. Validates and sanitizes visitor form fields (no CTA/source attribution).
 * 2. Persists the complete inquiry in SQLite (preventing duplicates).
 * 3. Sends notification email to GateShield and confirmation email to the visitor.
 * 4. Preserves saved inquiry record if email delivery fails.
 */
export async function POST(request: NextRequest) {
  const clientIp = extractClientIp(request);

  const ipLimit = checkIpRateLimit(clientIp);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error:
          'Too many requests from your connection. Please wait a few minutes before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(ipLimit.retryAfterSeconds) },
      }
    );
  }

  let rawText = '';
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json(
      { error: 'Unable to read request body.' },
      { status: 400 }
    );
  }

  if (!rawText || rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: 'Invalid or oversized form submission.' },
      { status: 400 }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request payload.' },
      { status: 400 }
    );
  }

  const validation = validateContactSubmission(parsedBody);
  if (!validation.ok) {
    return NextResponse.json(
      {
        error: validation.error,
        ...(validation.fieldErrors ? { fieldErrors: validation.fieldErrors } : {}),
      },
      { status: validation.status }
    );
  }

  const data = validation.data;

  const emailLimit = checkEmailRateLimit(data.email);
  if (!emailLimit.allowed) {
    return NextResponse.json(
      {
        error:
          'Multiple inquiries were recently submitted for this email. Please wait a few minutes before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(emailLimit.retryAfterSeconds) },
      }
    );
  }

  const visitorDeliverability = await verifyVisitorEmailDomain(data.email);
  if (visitorDeliverability.deliverable === false) {
    return NextResponse.json(
      {
        error:
          'Please enter a valid work email address with an active mail domain.',
        fieldErrors: {
          email:
            'Please enter a valid work email address with an active mail domain.',
        },
      },
      { status: 400 }
    );
  }

  const fingerprint = createSubmissionFingerprint(data);
  const lockToken = acquireInFlightLock(data.submissionId, fingerprint);
  if (!lockToken) {
    return NextResponse.json(
      {
        error:
          'Your submission is currently being sent. Please wait a moment.',
      },
      { status: 409 }
    );
  }

  try {
    const submittedAt = new Date();
    const saveResult = findOrCreateInquiry(data, fingerprint, submittedAt);

    if (saveResult.status === 'already_sent') {
      return NextResponse.json(
        {
          ok: true,
          deduplicated: true,
          inquiryId: saveResult.record.id,
          confirmationSent: saveResult.record.confirmation_sent === 1,
          message: 'Your inquiry has already been received.',
        },
        { status: 200 }
      );
    }

    if (saveResult.status === 'duplicate_payload') {
      return NextResponse.json(
        {
          error:
            'This inquiry was just submitted. Please wait a couple of minutes before sending it again.',
        },
        { status: 409 }
      );
    }

    const inquiry = saveResult.record;
    const inquiryDate = new Date(inquiry.submitted_at);

    try {
      const delivery = await sendLandingContactEmails(data, inquiryDate, {
        skipNotification: inquiry.notification_sent === 1,
        skipConfirmation: inquiry.confirmation_sent === 1,
        visitorDeliverability,
      });

      updateInquiryEmailStatus(inquiry.id, {
        notificationSent: delivery.notificationSent,
        notificationMessageId: delivery.notificationMessageId,
        confirmationSent: delivery.confirmationSent,
        confirmationMessageId: delivery.confirmationMessageId,
        emailError: null,
      });

      console.info(
        `[ContactAPI] Inquiry #${inquiry.id} saved and delivered [notifyId=${delivery.notificationMessageId ?? 'none'}, confirmSent=${delivery.confirmationSent}]`
      );

      return NextResponse.json(
        {
          ok: true,
          inquiryId: inquiry.id,
          confirmationSent: delivery.confirmationSent,
          message: 'Inquiry received! Our team will get back to you shortly.',
        },
        { status: 200 }
      );
    } catch (err) {
      if (err instanceof SmtpConfigurationError) {
        updateInquiryEmailStatus(inquiry.id, {
          notificationSent: inquiry.notification_sent === 1,
          confirmationSent: inquiry.confirmation_sent === 1,
          emailError: 'configuration_error',
        });
        console.error(
          `[ContactAPI] Inquiry #${inquiry.id} saved, SMTP configuration error:`,
          err.message
        );
        return NextResponse.json(
          {
            error:
              'Contact email service is currently unavailable. Please message us directly on WhatsApp.',
          },
          { status: 503 }
        );
      }

      const classified = classifySmtpError(err);
      updateInquiryEmailStatus(inquiry.id, {
        notificationSent: inquiry.notification_sent === 1,
        confirmationSent: inquiry.confirmation_sent === 1,
        emailError: classified.category,
      });
      console.error(
        `[ContactAPI] Inquiry #${inquiry.id} saved, SMTP delivery failure (${classified.category}).`
      );

      return NextResponse.json(
        {
          error:
            'We could not send your request right now. Please try again shortly or message us on WhatsApp.',
        },
        { status: 502 }
      );
    }
  } finally {
    releaseInFlightLock(data.submissionId, fingerprint, lockToken);
  }
}
