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

function option(value: string, label: string, selected: boolean): string {
  return `<option value="${escapeHtml(value)}"${selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
}

export function renderFilterPanel(data: SiteData, filters: FilterState, locale: Locale): string {
  const categories = [...new Set([...categoryIds, ...data.metadata.available_categories])].sort(
    (first, second) =>
      categoryLabel(first, locale).localeCompare(categoryLabel(second, locale), locale),
  );
  const cities = [...data.metadata.available_cities].sort((a, b) => a.localeCompare(b, locale));
  const languages = [
    ...new Set(data.events.events.flatMap((event) => event.language.codes)),
  ].sort();

  return `
    <form class="filter-panel" data-filter-form>
      <div class="filter-panel__heading">
        <h2>${translate(locale, 'filters')}</h2>
        <button type="button" class="text-button" data-reset-filters>${translate(locale, 'clear')}</button>
      </div>
      <label class="field field--search" for="event-search">
        <span>${translate(locale, 'search')}</span>
        <input id="event-search" name="q" type="search" placeholder="${translate(locale, 'searchPlaceholder')}" value="${escapeHtml(filters.text)}" autocomplete="off" />
      </label>
      <label class="field" for="event-category">
        <span>${translate(locale, 'category')}</span>
        <select id="event-category" name="category">
          ${option('all', translate(locale, 'allCategories'), filters.category === 'all')}
          ${categories.map((category) => option(category, categoryLabel(category, locale), filters.category === category)).join('')}
        </select>
      </label>
      <label class="field" for="event-city">
        <span>${translate(locale, 'city')}</span>
        <select id="event-city" name="city">
          ${option('all', translate(locale, 'allCities'), filters.city === 'all')}
          ${cities.map((city) => option(city, city, filters.city === city)).join('')}
        </select>
      </label>
      <label class="field" for="event-horizon">
        <span>${translate(locale, 'when')}</span>
        <select id="event-horizon" name="horizon">
          ${option('all', translate(locale, 'allFutureDates'), filters.horizon === 'all')}
          ${option('week', translate(locale, 'nextSevenDays'), filters.horizon === 'week')}
          ${option('weekend', translate(locale, 'thisWeekend'), filters.horizon === 'weekend')}
          ${option('month', translate(locale, 'laterThisMonth'), filters.horizon === 'month')}
        </select>
      </label>
      <label class="field" for="event-ranking">
        <span>${translate(locale, 'matchLevel')}</span>
        <select id="event-ranking" name="ranking">
          ${option('all', translate(locale, 'allLevels'), filters.ranking === 'all')}
          ${rankingLevels
            .map((value) => option(value, rankingLabel(value, locale), filters.ranking === value))
            .join('')}
        </select>
      </label>
      <label class="field" for="event-language">
        <span>${translate(locale, 'language')}</span>
        <select id="event-language" name="language">
          ${option('all', translate(locale, 'anyLanguage'), filters.language === 'all')}
          ${languages.map((language) => option(language, languageLabel(language, locale), filters.language === language)).join('')}
        </select>
      </label>
      <label class="field" for="event-tickets">
        <span>${translate(locale, 'tickets')}</span>
        <select id="event-tickets" name="tickets">
          ${option('all', translate(locale, 'anyTicketStatus'), filters.ticketStatus === 'all')}
          ${ticketStatuses.map((value) => option(value, ticketLabel(value, locale), filters.ticketStatus === value)).join('')}
        </select>
      </label>
      <label class="check-field" for="only-free">
        <input id="only-free" name="free" type="checkbox"${filters.freeOnly ? ' checked' : ''} />
        <span>${translate(locale, 'onlyFree')}</span>
      </label>
    </form>
  `;
}
