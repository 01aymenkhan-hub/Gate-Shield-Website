/**
 * Supported display currencies and PKR-base conversion helpers for GateShield pricing.
 */

export type CurrencyCode =
  | 'PKR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'AED'
  | 'SAR';

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
  region: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'PKR', symbol: 'PKR', label: 'Pakistani Rupee', region: 'Pakistan' },
  { code: 'USD', symbol: '$', label: 'US Dollar', region: 'United States' },
  { code: 'EUR', symbol: '€', label: 'Euro', region: 'Europe' },
  { code: 'GBP', symbol: '£', label: 'British Pound', region: 'United Kingdom' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', region: 'Australia' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar', region: 'Canada' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham', region: 'UAE' },
  { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal', region: 'Saudi Arabia' },
];

export const CURRENCY_MAP: Record<CurrencyCode, CurrencyOption> =
  SUPPORTED_CURRENCIES.reduce(
    (acc, item) => {
      acc[item.code] = item;
      return acc;
    },
    {} as Record<CurrencyCode, CurrencyOption>
  );

/**
 * Fallback exchange rates expressed as 1 PKR -> target currency units.
 * Used immediately on first render and whenever live rate lookup is unavailable.
 */
export const FALLBACK_RATES_FROM_PKR: Record<CurrencyCode, number> = {
  PKR: 1,
  USD: 1 / 278,
  EUR: 1 / 302,
  GBP: 1 / 352,
  AUD: 1 / 182,
  CAD: 1 / 200,
  AED: 1 / 75.7,
  SAR: 1 / 74.1,
};

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(CURRENCY_MAP, value)
  );
}

/**
 * Convert a PKR base amount to the selected currency.
 * Returns exact PKR value when PKR is selected; rounds foreign amounts cleanly to whole numbers.
 */
export function convertFromPkr(
  pkrAmount: number,
  currency: CurrencyCode,
  rates: Record<CurrencyCode, number> = FALLBACK_RATES_FROM_PKR
): number {
  if (currency === 'PKR') return Math.round(pkrAmount);
  const rate = rates[currency] ?? FALLBACK_RATES_FROM_PKR[currency] ?? 1;
  return Math.max(1, Math.round(pkrAmount * rate));
}

/** Format the numeric part (e.g. "9,950" or "36"). */
export function formatAmountNumber(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an inline converted price string (e.g. "PKR 84,000", "$302", "€278", "A$462"). */
export function formatInlinePrice(
  pkrAmount: number,
  currency: CurrencyCode,
  rates: Record<CurrencyCode, number> = FALLBACK_RATES_FROM_PKR
): string {
  const converted = convertFromPkr(pkrAmount, currency, rates);
  const formattedNumber = formatAmountNumber(converted);
  const info = CURRENCY_MAP[currency];

  // Prefix code-style symbols with a space ("PKR 84,000", "AED 1,110"), attach compact symbols directly ("$36", "€33", "A$55")
  const needsSpace = /^[A-Z]{3}$/.test(info.symbol);
  return needsSpace
    ? `${info.symbol} ${formattedNumber}`
    : `${info.symbol}${formattedNumber}`;
}
