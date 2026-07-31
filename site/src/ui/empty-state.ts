export function renderEmptyState(firstScanPending: boolean): string {
  return `
    <section class="empty-state">
      <span class="empty-state__star" aria-hidden="true">✦</span>
      <h2>${firstScanPending ? 'Поки що тут тихо' : 'Нічого не збіглося з фільтрами'}</h2>
      <p>${firstScanPending ? 'Перший повний скан FOMO Agent ще не завершено. Коли в канонічній базі з’являться перевірені події, вони автоматично з’являться тут.' : 'Спробуйте очистити або змінити фільтри. Ми не показуємо вигаданих подій замість чесної порожньої добірки.'}</p>
    </section>
  `;
}
