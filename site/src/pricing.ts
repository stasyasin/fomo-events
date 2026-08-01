import type { Pricing } from './types.js';
import type { Locale } from './i18n.js';
import { translate } from './i18n.js';

function formatMoney(value: number, currency: string | null, locale: Locale): string {
  if (!currency) {
    return `${new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', { maximumFractionDigits: 2 }).format(value)} (${translate(locale, 'currencyUnknown')})`;
  }
  return new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(pricing: Pricing, locale: Locale = 'uk'): string {
  if (pricing.is_free) return translate(locale, 'free');
  if (pricing.minimum === null && pricing.maximum === null)
    return translate(locale, 'priceUnknown');
  const currency = pricing.currency;
  if (pricing.minimum !== null && pricing.maximum !== null) {
    return pricing.minimum === pricing.maximum
      ? formatMoney(pricing.minimum, currency, locale)
      : `${formatMoney(pricing.minimum, currency, locale)} — ${formatMoney(pricing.maximum, currency, locale)}`;
  }
  return formatMoney(pricing.minimum ?? pricing.maximum ?? 0, currency, locale);
}

export function isKnownFree(pricing: Pricing): boolean {
  return pricing.is_free === true;
}
