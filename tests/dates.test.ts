import { describe, expect, it } from 'vitest';

import { eventDateKey, formatEventDate, parisDateKey } from '../site/src/dates.js';
import type { FomoEvent } from '../site/src/types.js';

const dateOnlyEvent = {
  start_at: '2030-06-15',
  end_at: null,
  date_precision: 'date',
  timezone: 'Europe/Paris',
} as FomoEvent;

describe('dates', () => {
  it('formats date-only event dates in Ukrainian without inventing a time', () => {
    expect(formatEventDate(dateOnlyEvent)).toBe('15 червня 2030 р.');
  });

  it('formats date-only event dates in English when selected', () => {
    expect(formatEventDate(dateOnlyEvent, 'en')).toBe('15 June 2030');
  });

  it('keeps unknown dates separate', () => {
    expect(
      eventDateKey({ ...dateOnlyEvent, start_at: null, date_precision: 'unknown' }),
    ).toBeNull();
  });

  it('uses Europe/Paris when deriving the current date', () => {
    expect(parisDateKey(new Date('2030-06-15T22:30:00Z'))).toBe('2030-06-16');
  });
});
