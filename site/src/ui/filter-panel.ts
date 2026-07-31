import {
  CATEGORY_LABELS,
  categoryLabel,
  languageLabel,
  RANKING_LABELS,
  TICKET_LABELS,
} from '../labels.js';
import type { FilterState, SiteData } from '../types.js';
import { escapeHtml } from './render.js';

function option(value: string, label: string, selected: boolean): string {
  return `<option value="${escapeHtml(value)}"${selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
}

export function renderFilterPanel(data: SiteData, filters: FilterState): string {
  const categories = [
    ...new Set([...Object.keys(CATEGORY_LABELS), ...data.metadata.available_categories]),
  ].sort((first, second) => categoryLabel(first).localeCompare(categoryLabel(second), 'uk'));
  const cities = [...data.metadata.available_cities].sort((a, b) => a.localeCompare(b, 'uk'));
  const languages = [
    ...new Set(data.events.events.flatMap((event) => event.language.codes)),
  ].sort();
  const ticketStatuses = Object.entries(TICKET_LABELS);

  return `
    <form class="filter-panel" data-filter-form>
      <div class="filter-panel__heading">
        <h2>Відфільтрувати</h2>
        <button type="button" class="text-button" data-reset-filters>Очистити</button>
      </div>
      <label class="field field--search" for="event-search">
        <span>Пошук</span>
        <input id="event-search" name="q" type="search" placeholder="Артист, місце, тема…" value="${escapeHtml(filters.text)}" autocomplete="off" />
      </label>
      <label class="field" for="event-category">
        <span>Категорія</span>
        <select id="event-category" name="category">
          ${option('all', 'Усі категорії', filters.category === 'all')}
          ${categories.map((category) => option(category, categoryLabel(category), filters.category === category)).join('')}
        </select>
      </label>
      <label class="field" for="event-city">
        <span>Місто</span>
        <select id="event-city" name="city">
          ${option('all', 'Усі міста', filters.city === 'all')}
          ${cities.map((city) => option(city, city, filters.city === city)).join('')}
        </select>
      </label>
      <label class="field" for="event-horizon">
        <span>Коли</span>
        <select id="event-horizon" name="horizon">
          ${option('all', 'Усі майбутні дати', filters.horizon === 'all')}
          ${option('week', 'Наступні 7 днів', filters.horizon === 'week')}
          ${option('weekend', 'Ці вихідні', filters.horizon === 'weekend')}
          ${option('month', 'Пізніше цього місяця', filters.horizon === 'month')}
        </select>
      </label>
      <label class="field" for="event-ranking">
        <span>Рівень збігу</span>
        <select id="event-ranking" name="ranking">
          ${option('all', 'Усі рівні', filters.ranking === 'all')}
          ${Object.entries(RANKING_LABELS)
            .map(([value, label]) => option(value, label, filters.ranking === value))
            .join('')}
        </select>
      </label>
      <label class="field" for="event-language">
        <span>Мова</span>
        <select id="event-language" name="language">
          ${option('all', 'Будь-яка мова', filters.language === 'all')}
          ${languages.map((language) => option(language, languageLabel(language), filters.language === language)).join('')}
        </select>
      </label>
      <label class="field" for="event-tickets">
        <span>Квитки</span>
        <select id="event-tickets" name="tickets">
          ${option('all', 'Будь-який статус', filters.ticketStatus === 'all')}
          ${ticketStatuses.map(([value, label]) => option(value, label, filters.ticketStatus === value)).join('')}
        </select>
      </label>
      <label class="check-field" for="only-free">
        <input id="only-free" name="free" type="checkbox"${filters.freeOnly ? ' checked' : ''} />
        <span>Лише безкоштовні</span>
      </label>
    </form>
  `;
}
