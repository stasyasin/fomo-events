import { formatUpdatedAt } from '../dates.js';
import { translate, type Locale } from '../i18n.js';
import type { FomoRun } from '../types.js';
import { escapeHtml } from './render.js';

export function renderRunHistory(
  runs: FomoRun[],
  reportLinks: Record<string, string>,
  locale: Locale,
): string {
  if (runs.length === 0) {
    return `
      <section class="run-history" aria-labelledby="updates-title">
        <p class="section-kicker">${translate(locale, 'updates')}</p>
        <h2 id="updates-title">${translate(locale, 'noScansTitle')}</h2>
        <p>${translate(locale, 'noScansBody')}</p>
      </section>
    `;
  }
  const items = [...runs]
    .sort((first, second) => second.ended_at.localeCompare(first.ended_at))
    .slice(0, 8)
    .map((run) => {
      const report = run.changed_files.find((file) => file in reportLinks);
      return `
        <article class="run-card">
          <div><strong>${escapeHtml(formatUpdatedAt(run.ended_at, locale))}</strong><span>${escapeHtml(run.mode)}</span></div>
          <p>${escapeHtml(run.summary)}</p>
          <ul><li>${translate(locale, 'newEvents', { count: run.new_events })}</li><li>${translate(locale, 'updatedEvents', { count: run.updated_events })}</li><li>${translate(locale, 'soldOutCancelled', { count: run.sold_out_events + run.cancelled_events })}</li></ul>
          ${run.warnings.length > 0 ? `<p class="run-card__warning">${escapeHtml(translate(locale, 'warning', { value: run.warnings.join(' · ') }))}</p>` : ''}
          ${report ? `<a href="${escapeHtml(reportLinks[report] ?? '')}" target="_blank" rel="noreferrer">${translate(locale, 'openReport')}</a>` : ''}
        </article>
      `;
    })
    .join('');
  return `<section class="run-history" aria-labelledby="updates-title"><p class="section-kicker">${translate(locale, 'updates')}</p><h2 id="updates-title">${translate(locale, 'collectionChanges')}</h2><div class="run-list">${items}</div></section>`;
}
