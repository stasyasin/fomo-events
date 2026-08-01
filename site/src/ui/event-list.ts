import { daysBetween, eventDateKey, parisDateKey } from '../dates.js';
import { translate, type Locale } from '../i18n.js';
import type { FomoEvent } from '../types.js';
import { renderEventCard } from './event-card.js';

interface EventGroup {
  title: string;
  events: FomoEvent[];
}

function groupEvents(events: FomoEvent[], locale: Locale): EventGroup[] {
  const today = parisDateKey();
  const nextSeven: FomoEvent[] = [];
  const laterThisMonth: FomoEvent[] = [];
  const comingMonths: FomoEvent[] = [];
  const unknownDate: FomoEvent[] = [];

  for (const event of events) {
    const date = eventDateKey(event);
    if (!date) {
      unknownDate.push(event);
      continue;
    }
    const distance = daysBetween(date, today);
    if (distance >= 0 && distance <= 6) nextSeven.push(event);
    else if (date.slice(0, 7) === today.slice(0, 7)) laterThisMonth.push(event);
    else comingMonths.push(event);
  }

  return [
    { title: translate(locale, 'groupNextSeven'), events: nextSeven },
    { title: translate(locale, 'groupLaterThisMonth'), events: laterThisMonth },
    { title: translate(locale, 'groupComingMonths'), events: comingMonths },
    { title: translate(locale, 'groupUnknownDate'), events: unknownDate },
  ].filter((group) => group.events.length > 0);
}

export function renderEventList(events: FomoEvent[], locale: Locale): string {
  return groupEvents(events, locale)
    .map(
      (group) => `
        <section class="event-group" aria-label="${group.title}">
          <h2>${group.title}</h2>
          <div class="event-list">${group.events.map((event) => renderEventCard(event, locale)).join('')}</div>
        </section>
      `,
    )
    .join('');
}
