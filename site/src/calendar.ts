import { addDays } from './dates.js';
import type { FomoEvent } from './types.js';

function escapeIcs(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(/\r?\n/g, '\\n');
}

function formatUtc(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replaceAll('-', '').replaceAll(':', '').replace('.000', '');
}

function dateOnly(value: string | null): string | null {
  return value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;
}

function compactDate(value: string): string {
  return value.replaceAll('-', '');
}

function safeUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function location(event: FomoEvent): string | null {
  const values = [
    event.venue.name,
    event.venue.address,
    event.venue.city,
    event.venue.region,
    event.venue.country,
  ].filter((value): value is string => Boolean(value));
  return values.length > 0 ? values.join(', ') : null;
}

export function createCalendarIcs(event: FomoEvent): string | null {
  const startDate = dateOnly(event.start_at);
  if (!startDate || event.date_precision === 'unknown' || event.date_precision === 'month')
    return null;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FOMO Côte d’Azur//Events//UK',
    'BEGIN:VEVENT',
  ];
  lines.push(`UID:${escapeIcs(`${event.id}@fomo-events`)}`);
  lines.push(`SUMMARY:${escapeIcs(event.title)}`);

  if (event.date_precision === 'datetime') {
    const start = event.start_at ? formatUtc(event.start_at) : null;
    if (!start) return null;
    lines.push(`DTSTART:${start}`);
    const end = event.end_at ? formatUtc(event.end_at) : null;
    if (end) lines.push(`DTEND:${end}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${compactDate(startDate)}`);
    const endDate = dateOnly(event.end_at);
    if (endDate) lines.push(`DTEND;VALUE=DATE:${compactDate(addDays(endDate, 1))}`);
  }

  const verified =
    event.tracking.last_verified_at ?? event.tracking.last_seen_at ?? event.tracking.first_seen_at;
  const stamp = verified ? formatUtc(verified) : null;
  if (stamp) lines.push(`DTSTAMP:${stamp}`);
  const eventLocation = location(event);
  if (eventLocation) lines.push(`LOCATION:${escapeIcs(eventLocation)}`);
  const url = safeUrl(event.ticketing.official_url) ?? safeUrl(event.sources[0]?.url ?? null);
  if (url) lines.push(`URL:${escapeIcs(url)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeIcs(event.description)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR', '');
  return lines.join('\r\n');
}

export function downloadCalendarFile(event: FomoEvent): void {
  const ics = createCalendarIcs(event);
  if (!ics) return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.id}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}
