import { formatUpdatedAt } from '../dates.js';
import type { FomoRun } from '../types.js';
import { escapeHtml } from './render.js';

export function renderRunHistory(runs: FomoRun[], reportLinks: Record<string, string>): string {
  if (runs.length === 0) {
    return `
      <section class="run-history" aria-labelledby="updates-title">
        <p class="section-kicker">Оновлення</p>
        <h2 id="updates-title">Ще не було жодного сканування</h2>
        <p>Історія перевірок з’явиться тут після першого запуску FOMO Agent.</p>
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
          <div><strong>${escapeHtml(formatUpdatedAt(run.ended_at))}</strong><span>${escapeHtml(run.mode)}</span></div>
          <p>${escapeHtml(run.summary)}</p>
          <ul><li>Нових: ${run.new_events}</li><li>Оновлено: ${run.updated_events}</li><li>Розпродано / скасовано: ${run.sold_out_events + run.cancelled_events}</li></ul>
          ${run.warnings.length > 0 ? `<p class="run-card__warning">Попередження: ${escapeHtml(run.warnings.join(' · '))}</p>` : ''}
          ${report ? `<a href="${escapeHtml(reportLinks[report] ?? '')}" target="_blank" rel="noreferrer">Відкрити звіт на GitHub ↗</a>` : ''}
        </article>
      `;
    })
    .join('');
  return `<section class="run-history" aria-labelledby="updates-title"><p class="section-kicker">Оновлення</p><h2 id="updates-title">Як змінювалася добірка</h2><div class="run-list">${items}</div></section>`;
}
