import { translate, type Locale } from '../i18n.js';

export function renderEmptyState(firstScanPending: boolean, locale: Locale): string {
  return `
    <section class="empty-state">
      <span class="empty-state__star" aria-hidden="true">✦</span>
      <h2>${translate(locale, firstScanPending ? 'emptyFirstScanTitle' : 'emptyNoResultsTitle')}</h2>
      <p>${translate(locale, firstScanPending ? 'emptyFirstScanBody' : 'emptyNoResultsBody')}</p>
    </section>
  `;
}
