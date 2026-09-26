import type { AppSettings } from '@/types';

export const CURRENCIES: Record<string, { symbol: string; label: string }> = {
  GHS: { symbol: 'GH₵', label: 'GHS — Ghana Cedi' },
  USD: { symbol: '$', label: 'USD — US Dollar' },
  GBP: { symbol: '£', label: 'GBP — British Pound' },
  EUR: { symbol: '€', label: 'EUR — Euro' },
};

export function formatCurrency(amount: number | null, currency: string = 'GHS'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  const c = CURRENCIES[currency] || CURRENCIES.GHS;
  return `${c.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysBetween(dateStr: string | null, fromDate?: Date): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const from = fromDate || new Date();
  const diff = Math.floor((from.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function defaultSettings(): AppSettings {
  return {
    businessName: 'Recoverly',
    currency: 'GHS',
    followUpTone: 'professional',
  };
}
