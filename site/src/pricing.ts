import type { Pricing } from './types.js';

function formatMoney(value: number, currency: string | null): string {
  if (!currency) {
    return `${new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(value)} (валюту не вказано)`;
  }
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(pricing: Pricing): string {
  if (pricing.is_free) return 'Безкоштовно';
  if (pricing.minimum === null && pricing.maximum === null) return 'Ціну не вказано';
  const currency = pricing.currency;
  if (pricing.minimum !== null && pricing.maximum !== null) {
    return pricing.minimum === pricing.maximum
      ? formatMoney(pricing.minimum, currency)
      : `${formatMoney(pricing.minimum, currency)} — ${formatMoney(pricing.maximum, currency)}`;
  }
  return formatMoney(pricing.minimum ?? pricing.maximum ?? 0, currency);
}

export function isKnownFree(pricing: Pricing): boolean {
  return pricing.is_free === true;
}
