import { createCalendarIcs } from '../calendar.js';
import { formatEventDate, formatUpdatedAt } from '../dates.js';
import { categoryLabel, languageLabel, RANKING_LABELS, TICKET_LABELS } from '../labels.js';
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

function location(event: FomoEvent): string {
  return (
    [event.venue.name, event.venue.city]
      .filter((value): value is string => Boolean(value))
      .join(' · ') || 'Місце уточнюється'
  );
}

export function renderEventCard(event: FomoEvent): string {
  const sourceUrl = safeLink(event.ticketing.official_url) ?? safeLink(event.sources[0]?.url);
  const language = event.language.codes.map(languageLabel).join(', ');
  const categories = event.categories
    .map((category) => `<span>${escapeHtml(categoryLabel(category))}</span>`)
    .join('');
  const reasons = event.ranking.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('');
  const canExportCalendar = createCalendarIcs(event) !== null;
  const price = formatPrice(event.pricing);
  const rankingLabel = RANKING_LABELS[event.ranking.level] ?? 'Рівень не вказано';
  const ticketLabel = TICKET_LABELS[event.ticketing.status] ?? 'Статус квитків не вказано';
  return `
    <article class="event-card${event.ranking.level === 'must_go' ? ' event-card--must-go' : ''}">
      <div class="event-card__date">${escapeHtml(formatEventDate(event))}</div>
      <div class="event-card__main">
        <div class="event-card__topline">
          <div class="event-card__badges">
            <span class="badge badge--${event.ranking.level}">${escapeHtml(rankingLabel)}</span>
            ${event.pricing.is_free ? '<span class="badge badge--free">Безкоштовно</span>' : ''}
          </div>
          <span class="event-card__status">${escapeHtml(ticketLabel)}</span>
        </div>
        <h3>${escapeHtml(event.title)}</h3>
        <p class="event-card__location">${escapeHtml(location(event))}</p>
        ${event.description ? `<p class="event-card__description">${escapeHtml(event.description)}</p>` : ''}
        <div class="event-card__meta">
          <span>${escapeHtml(price)}</span>
          <span>${language ? escapeHtml(language) : 'Мову не вказано'}</span>
        </div>
        <div class="event-card__categories" aria-label="Категорії">${categories}</div>
        ${reasons ? `<details class="event-card__reasons"><summary>Чому це може підійти</summary><ul>${reasons}</ul></details>` : ''}
        <div class="event-card__actions">
          ${sourceUrl ? `<a class="button button--primary" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Джерело <span aria-hidden="true">↗</span></a>` : '<span class="source-missing">Посилання на джерело не вказано</span>'}
          ${canExportCalendar ? `<button class="button button--secondary" type="button" data-calendar-event="${escapeHtml(event.id)}">Додати в календар</button>` : ''}
        </div>
        <p class="event-card__verified">Дата перевірки: ${escapeHtml(formatUpdatedAt(event.tracking.last_verified_at))}</p>
      </div>
    </article>
  `;
}
