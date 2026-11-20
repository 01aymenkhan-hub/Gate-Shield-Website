import { NextRequest, NextResponse } from 'next/server';
import {
  FALLBACK_RATES_FROM_PKR,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from '@/lib/currency';

export const runtime = 'nodejs';

interface CachedRates {
  rates: Record<CurrencyCode, number>;
  fetchedAt: number;
}

interface CachedGeo {
  country: string | null;
  fetchedAt: number;
}

const RATES_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const GEO_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const globalCache = globalThis as unknown as {
  __gateshieldRatesCache?: CachedRates;
  __gateshieldGeoCache?: Map<string, CachedGeo>;
};

function getGeoCache(): Map<string, CachedGeo> {
  if (!(globalCache.__gateshieldGeoCache instanceof Map)) {
    globalCache.__gateshieldGeoCache = new Map();
  }
  return globalCache.__gateshieldGeoCache;
}

function extractClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || null;
}

function isPrivateOrLocalIp(ip: string): boolean {
  const clean = ip.replace(/^::ffff:/i, '');
  if (
    clean === '::1' ||
    clean === '127.0.0.1' ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('fc') ||
    clean.startsWith('fd') ||
    clean.startsWith('fe80:')
  ) {
    return true;
  }
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(clean)) {
    return true;
  }
  return false;
}

function readCountryFromHeaders(request: NextRequest): string | null {
  const headerCandidates = [
    'cf-ipcountry',
    'x-vercel-ip-country',
    'cloudfront-viewer-country',
    'x-country-code',
    'fastly-client-ip-country',
  ];

  for (const name of headerCandidates) {
    const raw = request.headers.get(name)?.trim().toUpperCase();
    if (raw && /^[A-Z]{2}$/.test(raw) && raw !== 'XX' && raw !== 'T1') {
      return raw;
    }
  }
  return null;
}

async function lookupCountryByIp(ip: string): Promise<string | null> {
  const cache = getGeoCache();
  const cached = cache.get(ip);
  if (cached && Date.now() - cached.fetchedAt < GEO_TTL_MS) {
    return cached.country;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      success?: boolean;
      country_code?: string;
    };
    const code =
      json?.success && typeof json.country_code === 'string'
        ? json.country_code.trim().toUpperCase()
        : null;
    const valid = code && /^[A-Z]{2}$/.test(code) ? code : null;

    if (cache.size > 1000) cache.clear();
    cache.set(ip, { country: valid, fetchedAt: Date.now() });
    return valid;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getLatestPkrRates(): Promise<Record<CurrencyCode, number>> {
  const cached = globalCache.__gateshieldRatesCache;
  if (cached && Date.now() - cached.fetchedAt < RATES_TTL_MS) {
    return cached.rates;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/PKR', {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return FALLBACK_RATES_FROM_PKR;

    const json = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
    };

    if (json?.result !== 'success' || !json.rates) {
      return FALLBACK_RATES_FROM_PKR;
    }

    const merged: Record<CurrencyCode, number> = { ...FALLBACK_RATES_FROM_PKR };
    for (const item of SUPPORTED_CURRENCIES) {
      const value = json.rates[item.code];
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        merged[item.code] = value;
      }
    }
    merged.PKR = 1;

    globalCache.__gateshieldRatesCache = {
      rates: merged,
      fetchedAt: Date.now(),
    };
    return merged;
  } catch {
    return FALLBACK_RATES_FROM_PKR;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * GET /api/geo-currency
 * Resolves visitor country (PK => PKR, outside PK => USD) and returns cached PKR exchange rates.
 */
export async function GET(request: NextRequest) {
  let country = readCountryFromHeaders(request);
  let detectionSource: 'header' | 'ip' | 'unknown' = country
    ? 'header'
    : 'unknown';

  if (!country) {
    const clientIp = extractClientIp(request);
    if (clientIp && !isPrivateOrLocalIp(clientIp)) {
      country = await lookupCountryByIp(clientIp);
      if (country) detectionSource = 'ip';
    }
  }

  const rates = await getLatestPkrRates();
  const defaultCurrency: CurrencyCode | null = country
    ? country === 'PK'
      ? 'PKR'
      : 'USD'
    : null;

  return NextResponse.json(
    {
      country,
      detectionSource,
      defaultCurrency,
      rates,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store',
      },
    }
  );
}
