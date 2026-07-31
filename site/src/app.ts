import { downloadCalendarFile } from './calendar.js';
import { loadSiteData } from './data.js';
import {
  applyQuickView,
  defaultFilters,
  filtersFromSearch,
  filtersToSearch,
  type QuickView,
} from './filters.js';
import type { FilterState, SiteData } from './types.js';
import { renderPage } from './ui/render.js';

function formFilters(form: HTMLFormElement): FilterState {
  const values = new FormData(form);
  const params = new URLSearchParams();
  for (const [key, value] of values.entries()) {
    if (typeof value !== 'string') continue;
    if (key === 'free') params.set('free', '1');
    else if (value && value !== 'all') params.set(key, value);
  }
  return filtersFromSearch(params.toString());
}

function writeFilters(filters: FilterState): void {
  const query = filtersToSearch(filters);
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export async function startApp(): Promise<void> {
  const root = document.querySelector<HTMLElement>('#app');
  if (!root) return;
  const data: SiteData = await loadSiteData();
  let filters = filtersFromSearch();

  const update = (next: FilterState, updateUrl = true): void => {
    filters = next;
    if (updateUrl) writeFilters(filters);
    renderPage(root, data, filters);
  };

  root.addEventListener('input', (event) => {
    const form = (event.target as Element).closest<HTMLFormElement>('[data-filter-form]');
    if (form) update(formFilters(form));
  });
  root.addEventListener('change', (event) => {
    const form = (event.target as Element).closest<HTMLFormElement>('[data-filter-form]');
    if (form) update(formFilters(form));
  });
  root.addEventListener('click', (event) => {
    const target = event.target as Element;
    const quick = target.closest<HTMLButtonElement>('[data-quick]');
    if (quick) {
      update(applyQuickView(filters, quick.dataset.quick as QuickView));
      return;
    }
    if (target.closest('[data-reset-filters]')) {
      update(defaultFilters);
      return;
    }
    const calendarButton = target.closest<HTMLButtonElement>('[data-calendar-event]');
    const eventId = calendarButton?.dataset.calendarEvent;
    const selectedEvent = data.events.events.find((item) => item.id === eventId);
    if (selectedEvent) downloadCalendarFile(selectedEvent);
  });
  window.addEventListener('popstate', () => update(filtersFromSearch(), false));
  update(filters, false);
}
