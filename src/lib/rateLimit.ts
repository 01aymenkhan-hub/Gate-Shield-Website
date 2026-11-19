import crypto from 'node:crypto';
import type { SanitizedContactPayload } from './contactValidation';

/**
 * In-memory sliding-window rate limiter and concurrent in-flight submission lock.
 * Works alongside SQLite persistence to prevent spam bursts, duplicate DB rows,
 * and accidental duplicate emails on concurrent double-submits.
 */

const IP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const IP_MAX_REQUESTS = 20;

const EMAIL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const EMAIL_MAX_REQUESTS = 5;

export const IN_FLIGHT_TTL_MS = 60 * 1000; // 60 seconds safety TTL
const MAX_ENTRIES = 2000;
const STORE_VERSION = 2;

export interface InFlightLockEntry {
  acquiredAt: number;
  token: string;
}

interface LimiterStore {
  version: number;
  ipHits: Map<string, number[]>;
  emailHits: Map<string, number[]>;
  inFlightKeys: Map<string, InFlightLockEntry>;
}

const globalForRateLimit = globalThis as unknown as {
  __gateshieldContactLimiter?: unknown;
};

/**
 * Return the process-wide rate limiter store, safely normalizing any stale or
 * partially shaped global object left behind across Next.js dev hot reloads.
 */
function getStore(): LimiterStore {
  const existing = globalForRateLimit.__gateshieldContactLimiter as
    | Partial<LimiterStore>
    | null
    | undefined;

  const hasValidIpHits = existing?.ipHits instanceof Map;
  const hasValidEmailHits = existing?.emailHits instanceof Map;
  const hasValidInFlight = existing?.inFlightKeys instanceof Map;

  if (
    existing &&
    existing.version === STORE_VERSION &&
    hasValidIpHits &&
    hasValidEmailHits &&
    hasValidInFlight
  ) {
    return existing as LimiterStore;
  }

  // Preserve valid rate-limit Maps across hot reloads while normalizing missing/incompatible fields
  const ipHits = hasValidIpHits
    ? (existing!.ipHits as Map<string, number[]>)
    : new Map<string, number[]>();
  const emailHits = hasValidEmailHits
    ? (existing!.emailHits as Map<string, number[]>)
    : new Map<string, number[]>();
  const inFlightKeys = new Map<string, InFlightLockEntry>();

  if (hasValidInFlight) {
    for (const [key, rawValue] of existing!.inFlightKeys as Map<unknown, unknown>) {
      if (typeof key !== 'string') continue;
      if (
        rawValue &&
        typeof rawValue === 'object' &&
        typeof (rawValue as InFlightLockEntry).acquiredAt === 'number' &&
        typeof (rawValue as InFlightLockEntry).token === 'string'
      ) {
        inFlightKeys.set(key, rawValue as InFlightLockEntry);
      } else if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
        inFlightKeys.set(key, { acquiredAt: rawValue, token: 'legacy' });
      }
    }
  }

  const normalized: LimiterStore = {
    version: STORE_VERSION,
    ipHits,
    emailHits,
    inFlightKeys,
  };

  globalForRateLimit.__gateshieldContactLimiter = normalized;
  return normalized;
}

function checkSlidingWindow(
  map: Map<string, number[]>,
  key: string,
  windowMs: number,
  maxRequests: number,
  now: number
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const existing = (map.get(key) ?? []).filter((ts) => now - ts < windowMs);

  if (existing.length >= maxRequests) {
    const oldest = existing[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000)
    );
    map.set(key, existing);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(now);
  map.set(key, existing);

  if (map.size > MAX_ENTRIES) {
    for (const [entryKey, hits] of map) {
      const valid = hits.filter((ts) => now - ts < windowMs);
      if (valid.length === 0) {
        map.delete(entryKey);
      } else {
        map.set(entryKey, valid);
      }
    }
  }

  return { allowed: true };
}

/** Check IP-level rate limit for incoming POST /api/contact requests. */
export function checkIpRateLimit(
  ip: string,
  now = Date.now()
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const store = getStore();
  return checkSlidingWindow(
    store.ipHits,
    ip || 'unknown',
    IP_WINDOW_MS,
    IP_MAX_REQUESTS,
    now
  );
}

/** Check normalized email-level rate limit to block target flooding. */
export function checkEmailRateLimit(
  email: string,
  now = Date.now()
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const store = getStore();
  return checkSlidingWindow(
    store.emailHits,
    email.toLowerCase(),
    EMAIL_WINDOW_MS,
    EMAIL_MAX_REQUESTS,
    now
  );
}

/**
 * Build a deterministic SHA-256 fingerprint from actual submitted form fields
 * (without any CTA, button, or source attribution).
 */
export function createSubmissionFingerprint(
  data: SanitizedContactPayload
): string {
  const raw = [
    data.email.toLowerCase(),
    data.company.toLowerCase(),
    data.phone,
    data.facilityType.toLowerCase(),
    data.message.toLowerCase(),
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/**
 * Acquire a short-lived in-flight mutex to prevent concurrent duplicate requests.
 * Returns a unique lock token on success, or null if an active lock is already held.
 */
export function acquireInFlightLock(
  submissionId: string,
  fingerprint: string,
  now = Date.now()
): string | null {
  const store = getStore();

  for (const [key, entry] of store.inFlightKeys) {
    if (!entry || now - entry.acquiredAt > IN_FLIGHT_TTL_MS) {
      store.inFlightKeys.delete(key);
    }
  }

  const idKey = submissionId ? `id:${submissionId}` : '';
  const fpKey = `fp:${fingerprint}`;

  if ((idKey && store.inFlightKeys.has(idKey)) || store.inFlightKeys.has(fpKey)) {
    return null;
  }

  // Defensive cap against unbounded lock map growth
  if (store.inFlightKeys.size >= MAX_ENTRIES) {
    const oldestKey = store.inFlightKeys.keys().next().value;
    if (oldestKey !== undefined) {
      store.inFlightKeys.delete(oldestKey);
    }
  }

  const token = crypto.randomUUID();
  const lockEntry: InFlightLockEntry = { acquiredAt: now, token };

  if (idKey) store.inFlightKeys.set(idKey, lockEntry);
  store.inFlightKeys.set(fpKey, lockEntry);
  return token;
}

/**
 * Release the in-flight lock after processing finishes or fails.
 * If a lock token is provided, only releases entries owned by that token.
 */
export function releaseInFlightLock(
  submissionId: string,
  fingerprint: string,
  token?: string
): void {
  const store = getStore();
  const keys = [
    ...(submissionId ? [`id:${submissionId}`] : []),
    `fp:${fingerprint}`,
  ];

  for (const key of keys) {
    const current = store.inFlightKeys.get(key);
    if (!current) continue;
    if (!token || current.token === token) {
      store.inFlightKeys.delete(key);
    }
  }
}

/** Reset rate limit and lock maps (intended for automated tests). */
export function resetRateLimitStoreForTest(): void {
  const store = getStore();
  store.ipHits.clear();
  store.emailHits.clear();
  store.inFlightKeys.clear();
}
