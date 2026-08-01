import { createCalendarIcs } from '../calendar.js';
import { formatEventDate, formatUpdatedAt } from '../dates.js';
import { translate, type Locale } from '../i18n.js';
import { categoryLabel, languageLabel, rankingLabel, ticketLabel } from '../labels.js';
import { formatPrice } from '../pricing.js';
import type { FomoEvent } from '../types.js';
import { escapeHtml } from './render.js';

function safeLink(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function location(event: FomoEvent, locale: Locale): string {
  return (
    [event.venue.name, event.venue.city]
      .filter((value): value is string => Boolean(value))
      .join(' · ') || translate(locale, 'locationUnknown')
  );
}

export function renderEventCard(event: FomoEvent, locale: Locale): string {
  const sourceUrl = safeLink(event.ticketing.official_url) ?? safeLink(event.sources[0]?.url);
  const language = event.language.codes.map((code) => languageLabel(code, locale)).join(', ');
  const categories = event.categories
    .map((category) => `<span>${escapeHtml(categoryLabel(category, locale))}</span>`)
    .join('');
  const reasons = event.ranking.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('');
  const canExportCalendar = createCalendarIcs(event) !== null;
  const price = formatPrice(event.pricing, locale);
  const ranking = rankingLabel(event.ranking.level, locale) ?? translate(locale, 'rankingUnknown');
  const tickets =
    ticketLabel(event.ticketing.status, locale) ?? translate(locale, 'ticketsUnknown');
  return `
    <article class="event-card${event.ranking.level === 'must_go' ? ' event-card--must-go' : ''}">
      <div class="event-card__date">${escapeHtml(formatEventDate(event, locale))}</div>
      <div class="event-card__main">
        <div class="event-card__topline">
          <div class="event-card__badges">
            <span class="badge badge--${event.ranking.level}">${escapeHtml(ranking)}</span>
            ${event.pricing.is_free ? `<span class="badge badge--free">${translate(locale, 'free')}</span>` : ''}
          </div>
          <span class="event-card__status">${escapeHtml(tickets)}</span>
        </div>
        <h3>${escapeHtml(event.title)}</h3>
        <p class="event-card__location">${escapeHtml(location(event, locale))}</p>
        ${event.description ? `<p class="event-card__description">${escapeHtml(event.description)}</p>` : ''}
        <div class="event-card__meta">
          <span>${escapeHtml(price)}</span>
          <span>${language ? escapeHtml(language) : translate(locale, 'languageUnknown')}</span>
        </div>
        <div class="event-card__categories" aria-label="${translate(locale, 'categories')}">${categories}</div>
        ${reasons ? `<details class="event-card__reasons"><summary>${translate(locale, 'whyMatch')}</summary><ul>${reasons}</ul></details>` : ''}
        <div class="event-card__actions">
          ${sourceUrl ? `<a class="button button--primary" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">${translate(locale, 'source')} <span aria-hidden="true">↗</span></a>` : `<span class="source-missing">${translate(locale, 'sourceMissing')}</span>`}
          ${canExportCalendar ? `<button class="button button--secondary" type="button" data-calendar-event="${escapeHtml(event.id)}">${translate(locale, 'addToCalendar')}</button>` : ''}
        </div>
        <p class="event-card__verified">${escapeHtml(translate(locale, 'verifiedAt', { value: formatUpdatedAt(event.tracking.last_verified_at, locale) }))}</p>
      </div>
    </article>
  `;
}
