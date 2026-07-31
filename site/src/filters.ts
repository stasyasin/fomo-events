import { addDays, compareDateKeys, daysBetween, eventDateKey, parisDateKey } from './dates.js';
import type { FilterState, FomoEvent, Horizon, RankingLevel, TicketStatus } from './types.js';

const rankingLevels = new Set<RankingLevel>(['must_go', 'strong_match', 'maybe', 'low_priority']);
const ticketStatuses = new Set<TicketStatus>([
  'unknown',
  'not_on_sale',
  'presale',
  'available',
  'limited',
  'sold_out',
  'registration_required',
  'free_entry',
  'cancelled',
]);
const horizons = new Set<Horizon>(['all', 'week', 'weekend', 'month']);

export const defaultFilters: FilterState = {
  text: '',
  category: 'all',
  city: 'all',
  freeOnly: false,
  ranking: 'all',
  horizon: 'all',
  language: 'all',
  ticketStatus: 'all',
  newlyDiscovered: false,
  majorOnly: false,
};

function normaliseText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function filtersFromSearch(search = window.location.search): FilterState {
  const params = new URLSearchParams(search);
  const ranking = params.get('ranking');
  const ticketStatus = params.get('tickets');
  const horizon = params.get('horizon');
  return {
    text: params.get('q') ?? '',
    category: params.get('category') ?? 'all',
    city: params.get('city') ?? 'all',
    freeOnly: params.get('free') === '1',
    ranking:
      ranking && rankingLevels.has(ranking as RankingLevel) ? (ranking as RankingLevel) : 'all',
    horizon: horizon && horizons.has(horizon as Horizon) ? (horizon as Horizon) : 'all',
    language: params.get('language') ?? 'all',
    ticketStatus:
      ticketStatus && ticketStatuses.has(ticketStatus as TicketStatus)
        ? (ticketStatus as TicketStatus)
        : 'all',
    newlyDiscovered: params.get('new') === '1',
    majorOnly: params.get('major') === '1',
  };
}

export function filtersToSearch(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.text) params.set('q', filters.text);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.city !== 'all') params.set('city', filters.city);
  if (filters.freeOnly) params.set('free', '1');
  if (filters.ranking !== 'all') params.set('ranking', filters.ranking);
  if (filters.horizon !== 'all') params.set('horizon', filters.horizon);
  if (filters.language !== 'all') params.set('language', filters.language);
  if (filters.ticketStatus !== 'all') params.set('tickets', filters.ticketStatus);
  if (filters.newlyDiscovered) params.set('new', '1');
  if (filters.majorOnly) params.set('major', '1');
  return params.toString();
}

function weekendBounds(today: string): { start: string; end: string } {
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const offsets = [-2, 4, 3, 2, 1, 0, -1];
  const start = addDays(today, offsets[weekday] ?? 0);
  return { start, end: addDays(start, 2) };
}

function matchesHorizon(event: FomoEvent, horizon: Horizon, today: string): boolean {
  if (horizon === 'all') return true;
  const date = eventDateKey(event);
  if (!date) return false;
  if (horizon === 'week') return date >= today && date <= addDays(today, 6);
  if (horizon === 'month') return date.slice(0, 7) === today.slice(0, 7) && date >= today;
  const weekend = weekendBounds(today);
  return date >= weekend.start && date <= weekend.end;
}

function matchesText(event: FomoEvent, text: string): boolean {
  if (!text) return true;
  const searchable = [
    event.title,
    event.description ?? '',
    event.venue.name ?? '',
    event.venue.city ?? '',
    ...event.categories,
    ...event.ranking.reasons,
  ]
    .join(' ')
    .toLocaleLowerCase();
  return searchable.includes(text);
}

function isNew(event: FomoEvent, today: string): boolean {
  const firstSeen = event.tracking.first_seen_at?.slice(0, 10);
  return Boolean(firstSeen && firstSeen <= today && daysBetween(today, firstSeen) <= 7);
}

function isVisible(event: FomoEvent, today: string): boolean {
  if (['cancelled', 'expired', 'completed'].includes(event.status)) return false;
  const relevantDate =
    event.date_precision === 'range' && event.end_at
      ? event.end_at.slice(0, 10)
      : eventDateKey(event);
  return !relevantDate || relevantDate >= today;
}

export function filterEvents(
  events: FomoEvent[],
  filters: FilterState,
  now = new Date(),
): FomoEvent[] {
  const today = parisDateKey(now);
  const query = normaliseText(filters.text);
  return events
    .filter((event) => isVisible(event, today))
    .filter((event) => matchesText(event, query))
    .filter((event) => filters.category === 'all' || event.categories.includes(filters.category))
    .filter((event) => filters.city === 'all' || event.venue.city === filters.city)
    .filter((event) => !filters.freeOnly || event.pricing.is_free)
    .filter((event) => filters.ranking === 'all' || event.ranking.level === filters.ranking)
    .filter(
      (event) => filters.language === 'all' || event.language.codes.includes(filters.language),
    )
    .filter(
      (event) => filters.ticketStatus === 'all' || event.ticketing.status === filters.ticketStatus,
    )
    .filter((event) => !filters.newlyDiscovered || isNew(event, today))
    .filter(
      (event) =>
        !filters.majorOnly || (Array.isArray(event.tags) && event.tags.includes('major_event')),
    )
    .filter((event) => matchesHorizon(event, filters.horizon, today))
    .sort((first, second) => {
      const firstDate = eventDateKey(first);
      const secondDate = eventDateKey(second);
      if (!firstDate && !secondDate) return first.id.localeCompare(second.id);
      if (!firstDate) return 1;
      if (!secondDate) return -1;
      return compareDateKeys(firstDate, secondDate) || first.id.localeCompare(second.id);
    });
}

export type QuickView = 'all' | 'must-go' | 'free' | 'week' | 'weekend' | 'new' | 'major';

export function applyQuickView(filters: FilterState, quickView: QuickView): FilterState {
  if (quickView === 'all') return { ...defaultFilters, text: filters.text };
  const base = { ...defaultFilters, text: filters.text };
  if (quickView === 'must-go') return { ...base, ranking: 'must_go' };
  if (quickView === 'free') return { ...base, freeOnly: true };
  if (quickView === 'week') return { ...base, horizon: 'week' };
  if (quickView === 'weekend') return { ...base, horizon: 'weekend' };
  if (quickView === 'new') return { ...base, newlyDiscovered: true };
  return { ...base, majorOnly: true };
}

export function activeQuickView(filters: FilterState, quickView: QuickView): boolean {
  const serialised = filtersToSearch(filters);
  return serialised === filtersToSearch(applyQuickView({ ...defaultFilters }, quickView));
}
