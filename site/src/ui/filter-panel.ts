import {
  categoryIds,
  categoryLabel,
  languageLabel,
  rankingLabel,
  rankingLevels,
  ticketLabel,
  ticketStatuses,
} from '../labels.js';
import { translate, type Locale } from '../i18n.js';
import type { FilterState, SiteData } from '../types.js';
import { escapeHtml } from './render.js';

interface SelectOption {
  value: string;
  label: string;
}

function filterSelect(
  id: string,
  name: string,
  label: string,
  value: string,
  options: SelectOption[],
): string {
  const selected = options.find((option) => option.value === value) ?? options[0];
  if (!selected) return '';
  const labelId = `${id}-label`;
  const menuId = `${id}-options`;
  return `
    <div class="field field--select">
      <span id="${labelId}">${escapeHtml(label)}</span>
      <input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(selected.value)}" />
      <details class="select-menu" name="event-filter-menu">
        <summary aria-labelledby="${labelId}" aria-controls="${menuId}">
          <span class="select-menu__value">${escapeHtml(selected.label)}</span>
        </summary>
        <div id="${menuId}" class="select-menu__options" role="listbox" aria-labelledby="${labelId}">
          ${options
            .map(
              (option) => `
                <button
                  type="button"
                  role="option"
                  aria-selected="${option.value === selected.value}"
                  data-filter-option
                  data-filter-name="${escapeHtml(name)}"
                  data-filter-value="${escapeHtml(option.value)}"
                >${escapeHtml(option.label)}</button>`,
            )
            .join('')}
        </div>
      </details>
    </div>
  `;
}

export function renderFilterPanel(
  data: SiteData,
  filters: FilterState,
  locale: Locale,
  expanded: boolean,
): string {
  const categories = [...new Set([...categoryIds, ...data.metadata.available_categories])].sort(
    (first, second) =>
      categoryLabel(first, locale).localeCompare(categoryLabel(second, locale), locale),
  );
  const cities = [...data.metadata.available_cities].sort((a, b) => a.localeCompare(b, locale));
  const languages = [
    ...new Set(data.events.events.flatMap((event) => event.language.codes)),
  ].sort();
  const categoryOptions = [
    { value: 'all', label: translate(locale, 'allCategories') },
    ...categories.map((category) => ({ value: category, label: categoryLabel(category, locale) })),
  ];
  const cityOptions = [
    { value: 'all', label: translate(locale, 'allCities') },
    ...cities.map((city) => ({ value: city, label: city })),
  ];
  const horizonOptions = [
    { value: 'all', label: translate(locale, 'allFutureDates') },
    { value: 'week', label: translate(locale, 'nextSevenDays') },
    { value: 'weekend', label: translate(locale, 'thisWeekend') },
    { value: 'month', label: translate(locale, 'laterThisMonth') },
  ];
  const rankingOptions = [
    { value: 'all', label: translate(locale, 'allLevels') },
    ...rankingLevels.map((value) => ({ value, label: rankingLabel(value, locale) })),
  ];
  const languageOptions = [
    { value: 'all', label: translate(locale, 'anyLanguage') },
    ...languages.map((language) => ({ value: language, label: languageLabel(language, locale) })),
  ];
  const ticketOptions = [
    { value: 'all', label: translate(locale, 'anyTicketStatus') },
    ...ticketStatuses.map((value) => ({ value, label: ticketLabel(value, locale) })),
  ];

  return `
    <form class="filter-panel" data-filter-form data-expanded="${expanded}">
      <div class="filter-panel__heading">
        <h2>
          <button
            type="button"
            class="filter-panel__toggle"
            data-toggle-filter-panel
            aria-controls="filter-panel-body"
            aria-expanded="${expanded}"
          >${translate(locale, 'filters')}</button>
        </h2>
        <button type="button" class="text-button" data-reset-filters>${translate(locale, 'clear')}</button>
      </div>
      <div id="filter-panel-body" class="filter-panel__body">
        <label class="field field--search" for="event-search">
          <span>${translate(locale, 'search')}</span>
          <input id="event-search" name="q" type="search" placeholder="${translate(locale, 'searchPlaceholder')}" value="${escapeHtml(filters.text)}" autocomplete="off" />
        </label>
        ${filterSelect('event-category', 'category', translate(locale, 'category'), filters.category, categoryOptions)}
        ${filterSelect('event-city', 'city', translate(locale, 'city'), filters.city, cityOptions)}
        ${filterSelect('event-horizon', 'horizon', translate(locale, 'when'), filters.horizon, horizonOptions)}
        ${filterSelect('event-ranking', 'ranking', translate(locale, 'matchLevel'), filters.ranking, rankingOptions)}
        ${filterSelect('event-language', 'language', translate(locale, 'language'), filters.language, languageOptions)}
        ${filterSelect('event-tickets', 'tickets', translate(locale, 'tickets'), filters.ticketStatus, ticketOptions)}
        <label class="check-field" for="only-free">
          <input id="only-free" name="free" type="checkbox"${filters.freeOnly ? ' checked' : ''} />
          <span>${translate(locale, 'onlyFree')}</span>
        </label>
      </div>
    </form>
  `;
}
