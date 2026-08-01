import { describe, expect, it } from 'vitest';

import { formatPrice, isKnownFree } from '../site/src/pricing.js';
import type { Pricing } from '../site/src/types.js';

describe('pricing', () => {
  it('does not present an unknown price as free', () => {
    const unknown: Pricing = {
      currency: null,
      minimum: null,
      maximum: null,
      is_free: false,
      is_price_confirmed: false,
      notes: null,
    };
    expect(formatPrice(unknown)).toBe('Ціну не вказано');
    expect(isKnownFree(unknown)).toBe(false);
  });

  it('shows free only when explicitly confirmed in the event record', () => {
    expect(
      formatPrice({
        currency: 'EUR',
        minimum: 0,
        maximum: 0,
        is_free: true,
        is_price_confirmed: true,
        notes: null,
      }),
    ).toBe('Безкоштовно');
  });

  it('uses the selected language for free and unknown-price labels', () => {
    expect(
      formatPrice(
        {
          currency: 'EUR',
          minimum: 0,
          maximum: 0,
          is_free: true,
          is_price_confirmed: true,
          notes: null,
        },
        'en',
      ),
    ).toBe('Free');
    expect(
      formatPrice(
        {
          currency: null,
          minimum: null,
          maximum: null,
          is_free: false,
          is_price_confirmed: false,
          notes: null,
        },
        'en',
      ),
    ).toBe('Price not specified');
  });
});
