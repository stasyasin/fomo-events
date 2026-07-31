import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  defaultFilters,
  filterEvents,
  filtersFromSearch,
  filtersToSearch,
} from '../site/src/filters.js';
import type { EventDatabase } from '../site/src/types.js';

const fixture = JSON.parse(
  readFileSync('tests/fixtures/sample-events.json', 'utf8'),
) as EventDatabase;
const now = new Date('2030-06-01T10:00:00+02:00');

describe('event filters', () => {
  it('keeps an empty event database empty', () => {
    expect(filterEvents([], defaultFilters, now)).toEqual([]);
  });

  it('sorts chronological events and places unknown dates last', () => {
    const result = filterEvents(fixture.events, defaultFilters, now);
    expect(result.map((event) => event.id)).toEqual([
      'fictional-free-light-nice-2030-06-08',
      'fictional-sunset-strings-nice-2030-06-15',
      'fictional-unknown-date-antibes',
    ]);
  });

  it('excludes cancelled events, filters free events, category, city, text, and ranking', () => {
    expect(filterEvents(fixture.events, { ...defaultFilters, freeOnly: true }, now)).toHaveLength(
      1,
    );
    expect(
      filterEvents(fixture.events, { ...defaultFilters, category: 'classical_music' }, now)[0]
        ?.title,
    ).toContain('Strings');
    expect(filterEvents(fixture.events, { ...defaultFilters, city: 'Antibes' }, now)[0]?.id).toBe(
      'fictional-unknown-date-antibes',
    );
    expect(filterEvents(fixture.events, { ...defaultFilters, text: 'ukrainian' }, now)[0]?.id).toBe(
      'fictional-unknown-date-antibes',
    );
    expect(
      filterEvents(fixture.events, { ...defaultFilters, ranking: 'must_go' }, now)[0]?.id,
    ).toBe('fictional-sunset-strings-nice-2030-06-15');
  });

  it('serialises shareable filter state in a stable order', () => {
    const filters = filtersFromSearch(
      '?major=1&tickets=available&city=Nice&q=jazz&new=1&free=1&ranking=must_go&horizon=weekend&language=en',
    );
    expect(filtersToSearch(filters)).toBe(
      'q=jazz&city=Nice&free=1&ranking=must_go&horizon=weekend&language=en&tickets=available&new=1&major=1',
    );
  });
});
