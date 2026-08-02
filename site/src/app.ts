import { downloadCalendarFile } from './calendar.js';
import { loadSiteData } from './data.js';
import {
  applyQuickView,
  defaultFilters,
  filtersFromSearch,
  filtersToSearch,
  type QuickView,
} from './filters.js';
import { isLocale, localeFromSearch, saveLocale, translate, type Locale } from './i18n.js';
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

function writeFilters(filters: FilterState, locale: Locale): void {
  const params = new URLSearchParams(filtersToSearch(filters));
  params.set('lang', locale);
  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export async function startApp(): Promise<void> {
  const root = document.querySelector<HTMLElement>('#app');
  if (!root) return;
  const data: SiteData = await loadSiteData();
  let filters = filtersFromSearch();
  let locale = localeFromSearch();
  let filterPanelExpanded = false;

  const update = (next: FilterState, updateUrl = true): void => {
    filters = next;
    document.documentElement.lang = locale;
    document.title = `FOMO Côte d’Azur — ${translate(locale, 'eventCollection')}`;
    if (updateUrl) writeFilters(filters, locale);
    renderPage(root, data, filters, locale, filterPanelExpanded);
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
    const filterPanelToggle = target.closest<HTMLButtonElement>('[data-toggle-filter-panel]');
    if (filterPanelToggle) {
      filterPanelExpanded = !filterPanelExpanded;
      update(filters, false);
      return;
    }
    const filterOption = target.closest<HTMLButtonElement>('[data-filter-option]');
    if (filterOption) {
      const form = filterOption.closest<HTMLFormElement>('[data-filter-form]');
      const name = filterOption.dataset.filterName;
      const value = filterOption.dataset.filterValue;
      const input = name ? form?.elements.namedItem(name) : null;
      if (form && input instanceof HTMLInputElement && value !== undefined) {
        input.value = value;
        update(formFilters(form));
      }
      return;
    }
    const languageButton = target.closest<HTMLButtonElement>('[data-locale]');
    if (languageButton && isLocale(languageButton.dataset.locale)) {
      locale = languageButton.dataset.locale;
      saveLocale(locale);
      update(filters);
      return;
    }
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
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const menu = (event.target as Element).closest<HTMLDetailsElement>('.select-menu[open]');
    if (!menu) return;
    menu.open = false;
    menu.querySelector<HTMLElement>('summary')?.focus();
  });
  window.addEventListener('popstate', () => {
    locale = localeFromSearch();
    update(filtersFromSearch(), false);
  });
  update(filters, false);
}
