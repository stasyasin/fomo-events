import { daysBetween, eventDateKey, parisDateKey } from '../dates.js';
import type { FomoEvent } from '../types.js';
import { renderEventCard } from './event-card.js';

interface EventGroup {
  title: string;
  events: FomoEvent[];
}

function groupEvents(events: FomoEvent[]): EventGroup[] {
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
    { title: 'Наступні сім днів', events: nextSeven },
    { title: 'Пізніше цього місяця', events: laterThisMonth },
    { title: 'Найближчі місяці', events: comingMonths },
    { title: 'Дата ще не підтверджена', events: unknownDate },
  ].filter((group) => group.events.length > 0);
}

export function renderEventList(events: FomoEvent[]): string {
  return groupEvents(events)
    .map(
      (group) => `
        <section class="event-group" aria-label="${group.title}">
          <h2>${group.title}</h2>
          <div class="event-list">${group.events.map(renderEventCard).join('')}</div>
        </section>
      `,
    )
    .join('');
}
