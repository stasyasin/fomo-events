import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createCalendarIcs } from '../site/src/calendar.js';
import type { EventDatabase, FomoEvent } from '../site/src/types.js';

const fixture = JSON.parse(
  readFileSync('tests/fixtures/sample-events.json', 'utf8'),
) as EventDatabase;
const timedEvent = fixture.events[0] as FomoEvent;
const dateOnlyEvent = fixture.events[1] as FomoEvent;
const unknownDateEvent = fixture.events[2] as FomoEvent;

describe('calendar export', () => {
  it('creates an all-day ICS entry for date-only events', () => {
    expect(createCalendarIcs(dateOnlyEvent)).toContain('DTSTART;VALUE=DATE:20300608');
  });

  it('uses known datetime information and escapes ICS text', () => {
    const ics = createCalendarIcs({
      ...timedEvent,
      title: 'Fictional, semicolon; slash \\ newline\nshow',
    });
    expect(ics).toContain('DTSTART:20300615T173000Z');
    expect(ics).toContain('SUMMARY:Fictional\\, semicolon\\; slash \\\\ newline\\nshow');
  });

  it('does not export an event with an unknown date', () => {
    expect(createCalendarIcs(unknownDateEvent)).toBeNull();
  });

  it('ignores a malformed event URL instead of crashing calendar export', () => {
    const ics = createCalendarIcs({
      ...timedEvent,
      ticketing: { ...timedEvent.ticketing, official_url: 'not a URL' },
      sources: [],
    });
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).not.toContain('\r\nURL:');
  });
});
