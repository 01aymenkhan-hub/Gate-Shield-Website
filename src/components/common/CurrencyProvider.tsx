'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CURRENCY_MAP,
  FALLBACK_RATES_FROM_PKR,
  convertFromPkr,
  formatAmountNumber,
  formatInlinePrice,
  isSupportedCurrency,
  type CurrencyCode,
  type CurrencyOption,
} from '@/lib/currency';

const STORAGE_KEY = 'gateshield_preferred_currency';

interface CurrencyContextValue {
  currency: CurrencyCode;
  currencyInfo: CurrencyOption;
  rates: Record<CurrencyCode, number>;
  setCurrency: (code: CurrencyCode) => void;
  formatNumberFromPkr: (pkrAmount: number) => string;
  formatInlineFromPkr: (pkrAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  currencyInfo: CURRENCY_MAP.USD,
  rates: FALLBACK_RATES_FROM_PKR,
  setCurrency: () => {},
  formatNumberFromPkr: (amount) =>
    formatAmountNumber(convertFromPkr(amount, 'USD', FALLBACK_RATES_FROM_PKR)),
  formatInlineFromPkr: (amount) =>
    formatInlinePrice(amount, 'USD', FALLBACK_RATES_FROM_PKR),
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

function detectCurrencyFromBrowserTimezone(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Karachi') {
      return 'PKR';
    }
  } catch {
    // ignore timezone errors
  }
  return 'USD';
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(
    FALLBACK_RATES_FROM_PKR
  );

  useEffect(() => {
    let cancelled = false;

    let savedPreference: CurrencyCode | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isSupportedCurrency(stored)) {
        savedPreference = stored;
      }
    } catch {
      // ignore storage errors
    }

    if (savedPreference) {
      setCurrencyState(savedPreference);
    } else {
      // Immediate timezone-based initial currency so Pakistan users see PKR without waiting
      setCurrencyState(detectCurrencyFromBrowserTimezone());
    }

    // Fetch server-side geo detection & live PKR conversion rates
    fetch('/api/geo-currency', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          payload: {
            defaultCurrency?: CurrencyCode | null;
            rates?: Record<CurrencyCode, number>;
          } | null
        ) => {
          if (cancelled || !payload) return;

          if (payload.rates) {
            setRates((prev) => ({ ...prev, ...payload.rates, PKR: 1 }));
          }

          if (
            !savedPreference &&
            payload.defaultCurrency &&
            isSupportedCurrency(payload.defaultCurrency)
          ) {
            setCurrencyState(payload.defaultCurrency);
          }
        }
      )
      .catch(() => {
        // Fallback timezone currency & static rates remain active
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      currencyInfo: CURRENCY_MAP[currency],
      rates,
      setCurrency,
      formatNumberFromPkr: (pkrAmount: number) =>
        formatAmountNumber(convertFromPkr(pkrAmount, currency, rates)),
      formatInlineFromPkr: (pkrAmount: number) =>
        formatInlinePrice(pkrAmount, currency, rates),
    }),
    [currency, rates, setCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
