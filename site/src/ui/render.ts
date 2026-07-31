import type { FilterState, SiteData } from '../types.js';
import { renderEmptyState } from './empty-state.js';
import { renderEventList } from './event-list.js';
import { renderFilterPanel } from './filter-panel.js';
import { renderRunHistory } from './run-history.js';
import type { QuickView } from '../filters.js';
import { activeQuickView, filterEvents } from '../filters.js';
import { formatUpdatedAt } from '../dates.js';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function quickButton(filters: FilterState, id: QuickView, label: string): string {
  const active = activeQuickView(filters, id);
  return `<button class="quick-chip" type="button" data-quick="${id}" aria-pressed="${active}">${label}</button>`;
}

export function renderPage(root: HTMLElement, data: SiteData, filters: FilterState): void {
  const filteredEvents = filterEvents(data.events.events, filters);
  const hasNoEvents = data.events.events.length === 0;
  const repositoryUrl = escapeHtml(data.metadata.repository_url);
  root.innerHTML = `
    <div class="site-shell">
      <header class="masthead">
        <div class="masthead__eyebrow"><span aria-hidden="true">✦</span> Лазурний радар</div>
        <div class="masthead__topline">
          <div>
            <h1>FOMO Côte d’Azur</h1>
            <p class="masthead__lede">Події, які шкода пропустити на Лазурному узбережжі.</p>
          </div>
          <a class="repository-link" href="${repositoryUrl}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <p class="data-status"><span class="data-status__dot" aria-hidden="true"></span> Дані оновлено: ${escapeHtml(formatUpdatedAt(data.metadata.data_updated_at))}</p>
      </header>

      <section class="quick-views" aria-label="Швидкі добірки">
        ${quickButton(filters, 'all', 'Усі події')}
        ${quickButton(filters, 'must-go', 'Не пропустити')}
        ${quickButton(filters, 'free', 'Безкоштовні')}
        ${quickButton(filters, 'week', 'Цього тижня')}
        ${quickButton(filters, 'weekend', 'Цими вихідними')}
        ${quickButton(filters, 'new', 'Нові')}
        ${quickButton(filters, 'major', 'Великі події')}
      </section>

      <section class="content-grid" aria-label="Добірка подій">
        <aside class="filters-wrap">
          ${renderFilterPanel(data, filters)}
        </aside>
        <div class="event-area">
          <div class="results-heading">
            <p class="section-kicker">Добірка</p>
            <h2>${hasNoEvents ? 'Події з’являться після першого сканування' : `Знайдено: ${filteredEvents.length}`}</h2>
          </div>
          ${hasNoEvents || filteredEvents.length === 0 ? renderEmptyState(hasNoEvents) : renderEventList(filteredEvents)}
        </div>
      </section>

      ${renderRunHistory(data.run_history.runs, data.metadata.report_links)}
      <footer class="footer">
        <p>Створено на основі <a href="https://github.com/stasyasin/fomo-agent" target="_blank" rel="noreferrer">FOMO Agent</a>. Дані походять із публічних джерел; перед поїздкою або купівлею квитків перевірте деталі на офіційному сайті.</p>
        <p>Без трекерів, реклами чи персональних даних · <a href="${repositoryUrl}" target="_blank" rel="noreferrer">код і дані проєкту</a></p>
      </footer>
    </div>
  `;
}
