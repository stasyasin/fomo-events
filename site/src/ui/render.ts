import type { FilterState, SiteData } from '../types.js';
import { renderEmptyState } from './empty-state.js';
import { renderEventList } from './event-list.js';
import { renderFilterPanel } from './filter-panel.js';
import { renderRunHistory } from './run-history.js';
import type { QuickView } from '../filters.js';
import { activeQuickView, filterEvents } from '../filters.js';
import { formatUpdatedAt } from '../dates.js';
import { translate, type Locale } from '../i18n.js';

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

function languageButton(locale: Locale, selectedLocale: Locale): string {
  const active = locale === selectedLocale;
  const label = locale === 'uk' ? 'UA' : 'EN';
  const languageName = translate(selectedLocale, locale === 'uk' ? 'languageUk' : 'languageEn');
  return `<button type="button" data-locale="${locale}" aria-pressed="${active}" aria-label="${languageName}" title="${languageName}">${label}</button>`;
}

export function renderPage(
  root: HTMLElement,
  data: SiteData,
  filters: FilterState,
  locale: Locale,
): void {
  const filteredEvents = filterEvents(data.events.events, filters);
  const hasNoEvents = data.events.events.length === 0;
  const repositoryUrl = escapeHtml(data.metadata.repository_url);
  root.innerHTML = `
    <div class="site-atmosphere" aria-hidden="true">
      <span class="site-atmosphere__flare"></span>
      <span class="site-atmosphere__orbit site-atmosphere__orbit--one"></span>
      <span class="site-atmosphere__orbit site-atmosphere__orbit--two"></span>
      <span class="site-atmosphere__scan"></span>
    </div>
    <div class="site-shell">
      <header class="masthead">
        <div class="masthead__eyebrow"><span aria-hidden="true">✦</span> ${translate(locale, 'radar')}</div>
        <div class="masthead__topline">
          <div>
            <h1>FOMO Côte d’Azur</h1>
            <p class="masthead__lede">${translate(locale, 'lede')}</p>
          </div>
          <div class="masthead__actions">
            <div class="language-switcher" role="group" aria-label="${translate(locale, 'languageSwitcher')}">
              ${languageButton('uk', locale)}
              ${languageButton('en', locale)}
            </div>
            <a class="repository-link" href="${repositoryUrl}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <p class="data-status"><span class="data-status__dot" aria-hidden="true"></span> ${escapeHtml(translate(locale, 'dataUpdated', { value: formatUpdatedAt(data.metadata.data_updated_at, locale) }))}</p>
      </header>

      <section class="quick-views" aria-label="${translate(locale, 'quickViews')}">
        ${quickButton(filters, 'all', translate(locale, 'quickAll'))}
        ${quickButton(filters, 'must-go', translate(locale, 'quickMustGo'))}
        ${quickButton(filters, 'free', translate(locale, 'quickFree'))}
        ${quickButton(filters, 'week', translate(locale, 'quickWeek'))}
        ${quickButton(filters, 'weekend', translate(locale, 'quickWeekend'))}
        ${quickButton(filters, 'new', translate(locale, 'quickNew'))}
        ${quickButton(filters, 'major', translate(locale, 'quickMajor'))}
      </section>

      <section class="content-grid" aria-label="${translate(locale, 'eventCollection')}">
        <aside class="filters-wrap">
          ${renderFilterPanel(data, filters, locale)}
        </aside>
        <div class="event-area">
          <div class="results-heading">
            <p class="section-kicker">${translate(locale, 'collection')}</p>
            <h2>${hasNoEvents ? translate(locale, 'firstScanTitle') : translate(locale, 'eventsFound', { count: filteredEvents.length })}</h2>
          </div>
          ${hasNoEvents || filteredEvents.length === 0 ? renderEmptyState(hasNoEvents, locale) : renderEventList(filteredEvents, locale)}
        </div>
      </section>

      ${renderRunHistory(data.run_history.runs, data.metadata.report_links, locale)}
      <footer class="footer">
        <p>${translate(locale, 'footerSource').replace('FOMO Agent', '<a href="https://github.com/stasyasin/fomo-agent" target="_blank" rel="noreferrer">FOMO Agent</a>')}</p>
        <p>${translate(locale, 'footerPrivacy').replace('код і дані проєкту', `<a href="${repositoryUrl}" target="_blank" rel="noreferrer">код і дані проєкту</a>`).replace('project code and data', `<a href="${repositoryUrl}" target="_blank" rel="noreferrer">project code and data</a>`)}</p>
      </footer>
    </div>
  `;
}
