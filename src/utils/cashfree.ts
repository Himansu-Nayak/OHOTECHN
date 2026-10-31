/**
 * Cashfree Payments JavaScript SDK v3 Dynamic Loader
 * Ensures script is loaded once safely with appropriate environment mode.
 */

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
  }
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: '_modal' | '_self' | '_blank';
}

export interface CashfreeCheckoutResult {
  error?: {
    message?: string;
    code?: string;
  };
  redirect?: boolean;
  paymentDetails?: {
    paymentMessage?: string;
  };
}

export interface CashfreeInstance {
  checkout: (options: CashfreeCheckoutOptions) => Promise<CashfreeCheckoutResult>;
}

let cashfreePromise: Promise<boolean> | null = null;

export function loadCashfreeScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Cashfree) return Promise.resolve(true);
  if (cashfreePromise) return cashfreePromise;

  cashfreePromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src*="sdk.cashfree.com/js/v3/cashfree.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Cashfree SDK from official CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return cashfreePromise;
}

export async function getCashfreeInstance(environment: 'sandbox' | 'production' = 'sandbox'): Promise<CashfreeInstance | null> {
  const loaded = await loadCashfreeScript();
  if (!loaded || !window.Cashfree) {
    return null;
  }
  return window.Cashfree({ mode: environment });
}
