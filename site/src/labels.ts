import type { RankingLevel, TicketStatus } from './types.js';

export const CATEGORY_LABELS: Record<string, string> = {
  concerts: 'Концерти',
  classical_music: 'Класична музика',
  opera_and_ballet: 'Опера та балет',
  jazz_and_blues: 'Джаз і блюз',
  theatre: 'Театр',
  comedy: 'Комедія',
  museums_and_art: 'Музеї та мистецтво',
  exhibitions: 'Виставки',
  festivals: 'Фестивалі',
  city_events: 'Міські події',
  free_events: 'Безкоштовні події',
  food_and_wine: 'Їжа та вино',
  markets: 'Маркети',
  cinema: 'Кіно',
  sports: 'Спорт',
  business_and_tech: 'Бізнес і технології',
  outdoor: 'На відкритому повітрі',
  astronomy: 'Астрономія',
  unusual_experiences: 'Незвичні враження',
};

export const RANKING_LABELS: Record<RankingLevel, string> = {
  must_go: 'Не пропустити',
  strong_match: 'Дуже цікаво',
  maybe: 'Можливо',
  low_priority: 'Низький пріоритет',
};

export const TICKET_LABELS: Record<TicketStatus, string> = {
  unknown: 'Статус квитків не вказано',
  not_on_sale: 'Продаж ще не відкрито',
  presale: 'Передпродаж',
  available: 'Квитки доступні',
  limited: 'Залишилося мало квитків',
  sold_out: 'Квитки розпродано',
  registration_required: 'Потрібна реєстрація',
  free_entry: 'Вільний вхід',
  cancelled: 'Подію скасовано',
};

export const LANGUAGE_LABELS: Record<string, string> = {
  uk: 'українська',
  en: 'англійська',
  fr: 'французька',
  it: 'італійська',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replaceAll('_', ' ');
}

export function languageLabel(code: string): string {
  return LANGUAGE_LABELS[code.toLowerCase()] ?? code.toUpperCase();
}
