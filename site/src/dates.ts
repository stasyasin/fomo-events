import type { FomoEvent } from './types.js';

const paris = 'Europe/Paris';

function dateParts(date: Date, timeZone = paris): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
}

export function parisDateKey(date = new Date()): string {
  const parts = dateParts(date);
  return `${parts.year ?? '1970'}-${parts.month ?? '01'}-${parts.day ?? '01'}`;
}

export function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function eventDateKey(event: FomoEvent): string | null {
  if (!event.start_at || event.date_precision === 'unknown') return null;
  if (/^\d{4}-\d{2}$/.test(event.start_at)) return `${event.start_at}-01`;
  return /^\d{4}-\d{2}-\d{2}/.test(event.start_at) ? event.start_at.slice(0, 10) : null;
}

export function compareDateKeys(first: string, second: string): number {
  return first.localeCompare(second);
}

export function formatDateKey(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: paris,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatEventDate(event: FomoEvent): string {
  if (!event.start_at || event.date_precision === 'unknown') return 'Дата уточнюється';
  if (event.date_precision === 'month' && /^\d{4}-\d{2}$/.test(event.start_at)) {
    return new Intl.DateTimeFormat('uk-UA', {
      timeZone: paris,
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${event.start_at}-01T12:00:00Z`));
  }
  const dateKey = eventDateKey(event);
  if (!dateKey) return 'Дата уточнюється';
  const start = formatDateKey(dateKey);
  if (event.date_precision === 'datetime') {
    const parsed = new Date(event.start_at);
    if (!Number.isNaN(parsed.getTime())) {
      const time = new Intl.DateTimeFormat('uk-UA', {
        timeZone: event.timezone ?? paris,
        hour: '2-digit',
        minute: '2-digit',
      }).format(parsed);
      return `${start}, ${time}`;
    }
  }
  const endKey = event.end_at ? event.end_at.slice(0, 10) : null;
  return event.date_precision === 'range' && endKey && endKey !== dateKey
    ? `${start} — ${formatDateKey(endKey)}`
    : start;
}

export function formatUpdatedAt(value: string | null): string {
  if (!value) return 'ще не оновлювали';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'дата оновлення не вказана';
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: paris,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function daysBetween(first: string, second: string): number {
  return Math.round(
    (new Date(`${first}T12:00:00Z`).getTime() - new Date(`${second}T12:00:00Z`).getTime()) /
      86_400_000,
  );
}
