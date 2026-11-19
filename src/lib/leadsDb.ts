import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { SanitizedContactPayload } from './contactValidation';

/**
 * Persistent SQLite storage for GateShield landing page inquiries.
 * Saves all actual visitor-submitted form fields and timestamps without
 * tracking or storing any CTA, button, section, or source attribution.
 */

export interface StoredInquiryRecord {
  id: number;
  submission_id: string | null;
  fingerprint: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  facility_type: string;
  message: string;
  submitted_at: string;
  notification_sent: number;
  notification_message_id: string | null;
  confirmation_sent: number;
  confirmation_message_id: string | null;
  email_error: string | null;
  created_at: string;
}

export type InquirySaveResult =
  | { status: 'created'; record: StoredInquiryRecord }
  | { status: 'retry_existing'; record: StoredInquiryRecord }
  | { status: 'already_sent'; record: StoredInquiryRecord }
  | { status: 'duplicate_payload'; record: StoredInquiryRecord };

export interface InquiryEmailStatusUpdate {
  notificationSent: boolean;
  notificationMessageId?: string;
  confirmationSent: boolean;
  confirmationMessageId?: string;
  emailError?: string | null;
}

const DEFAULT_DEDUP_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

const globalForLeadsDb = globalThis as unknown as {
  __gateshieldLeadsDb?: { db: DatabaseSync; dbPath: string };
};

export function getLeadsDbPath(): string {
  const configured = process.env.LEADS_DB_PATH?.trim();
  if (configured) {
    return path.resolve(configured);
  }
  return path.join(process.cwd(), 'data', 'leads.db');
}

function getDb(): DatabaseSync {
  const targetPath = getLeadsDbPath();
  if (
    globalForLeadsDb.__gateshieldLeadsDb &&
    globalForLeadsDb.__gateshieldLeadsDb.dbPath === targetPath &&
    typeof globalForLeadsDb.__gateshieldLeadsDb.db?.prepare === 'function'
  ) {
    return globalForLeadsDb.__gateshieldLeadsDb.db;
  }

  if (globalForLeadsDb.__gateshieldLeadsDb) {
    try {
      globalForLeadsDb.__gateshieldLeadsDb.db.close();
    } catch {
      // ignore prior close error
    }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const db = new DatabaseSync(targetPath);

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS website_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id TEXT UNIQUE,
      fingerprint TEXT NOT NULL,
      full_name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      facility_type TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      submitted_at TEXT NOT NULL,
      notification_sent INTEGER NOT NULL DEFAULT 0,
      notification_message_id TEXT,
      confirmation_sent INTEGER NOT NULL DEFAULT 0,
      confirmation_message_id TEXT,
      email_error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_website_inquiries_fingerprint_submitted
      ON website_inquiries (fingerprint, submitted_at);

    CREATE INDEX IF NOT EXISTS idx_website_inquiries_email
      ON website_inquiries (email);
  `);

  globalForLeadsDb.__gateshieldLeadsDb = { db, dbPath: targetPath };
  return db;
}

function toStoredRecord(row: Record<string, unknown>): StoredInquiryRecord {
  return {
    id: Number(row.id),
    submission_id: row.submission_id == null ? null : String(row.submission_id),
    fingerprint: String(row.fingerprint),
    full_name: String(row.full_name),
    company: String(row.company),
    email: String(row.email),
    phone: String(row.phone),
    facility_type: String(row.facility_type),
    message: String(row.message ?? ''),
    submitted_at: String(row.submitted_at),
    notification_sent: Number(row.notification_sent ?? 0),
    notification_message_id:
      row.notification_message_id == null
        ? null
        : String(row.notification_message_id),
    confirmation_sent: Number(row.confirmation_sent ?? 0),
    confirmation_message_id:
      row.confirmation_message_id == null
        ? null
        : String(row.confirmation_message_id),
    email_error: row.email_error == null ? null : String(row.email_error),
    created_at: String(row.created_at),
  };
}

/**
 * Save a new website inquiry or resolve an existing matching submission to prevent
 * duplicate database rows and duplicate emails. Preserves leads even if SMTP fails.
 */
export function findOrCreateInquiry(
  data: SanitizedContactPayload,
  fingerprint: string,
  submittedAt: Date,
  dedupWindowMs = DEFAULT_DEDUP_WINDOW_MS
): InquirySaveResult {
  const db = getDb();
  const normalizedSubId = data.submissionId ? data.submissionId : null;
  const submittedAtIso = submittedAt.toISOString();

  // 1. Check idempotency key first
  if (normalizedSubId) {
    const existingById = db
      .prepare('SELECT * FROM website_inquiries WHERE submission_id = ? LIMIT 1')
      .get(normalizedSubId) as Record<string, unknown> | undefined;

    if (existingById) {
      const record = toStoredRecord(existingById);
      if (record.notification_sent === 1) {
        return { status: 'already_sent', record };
      }
      return { status: 'retry_existing', record };
    }
  }

  // 2. Check recent identical payload fingerprint within deduplication window
  const recentByFp = db
    .prepare(
      'SELECT * FROM website_inquiries WHERE fingerprint = ? ORDER BY id DESC LIMIT 1'
    )
    .get(fingerprint) as Record<string, unknown> | undefined;

  if (recentByFp) {
    const record = toStoredRecord(recentByFp);
    const ageMs = submittedAt.getTime() - Date.parse(record.submitted_at);
    if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= dedupWindowMs) {
      if (record.notification_sent === 1) {
        return { status: 'duplicate_payload', record };
      }
      return { status: 'retry_existing', record };
    }
  }

  // 3. Persist new inquiry record (actual form fields only — zero CTA/source attribution)
  const insertStmt = db.prepare(`
    INSERT INTO website_inquiries (
      submission_id,
      fingerprint,
      full_name,
      company,
      email,
      phone,
      facility_type,
      message,
      submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    normalizedSubId,
    fingerprint,
    data.fullName,
    data.company,
    data.email,
    data.phone,
    data.facilityType,
    data.message,
    submittedAtIso
  );

  const inserted = db
    .prepare('SELECT * FROM website_inquiries WHERE id = ? LIMIT 1')
    .get(Number(result.lastInsertRowid)) as Record<string, unknown>;

  return {
    status: 'created',
    record: toStoredRecord(inserted),
  };
}

/** Update email delivery status for a persisted inquiry record without losing lead data. */
export function updateInquiryEmailStatus(
  id: number,
  update: InquiryEmailStatusUpdate
): void {
  const db = getDb();
  db.prepare(`
    UPDATE website_inquiries
    SET
      notification_sent = ?,
      notification_message_id = COALESCE(?, notification_message_id),
      confirmation_sent = ?,
      confirmation_message_id = COALESCE(?, confirmation_message_id),
      email_error = ?
    WHERE id = ?
  `).run(
    update.notificationSent ? 1 : 0,
    update.notificationMessageId ?? null,
    update.confirmationSent ? 1 : 0,
    update.confirmationMessageId ?? null,
    update.emailError ?? null,
    id
  );
}

/** Close cached database handle cleanly if needed. */
export function closeLeadsDb(): void {
  if (globalForLeadsDb.__gateshieldLeadsDb) {
    try {
      globalForLeadsDb.__gateshieldLeadsDb.db.close();
    } catch {
      // ignore
    }
    delete globalForLeadsDb.__gateshieldLeadsDb;
  }
}
