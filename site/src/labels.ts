import type { Locale } from './i18n.js';
import type { RankingLevel, TicketStatus } from './types.js';

const categoryLabels = {
  uk: {
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
    cinema_highlights: 'Добірка кіно',
    sports: 'Спорт',
    football: 'Футбол',
    tennis: 'Теніс',
    business_and_tech: 'Бізнес і технології',
    outdoor: 'На відкритому повітрі',
    open_air_music: 'Концерти просто неба',
    dj_and_electronic: 'DJ та електроніка',
    creative_workshops: 'Творчі майстер-класи',
    astronomy: 'Астрономія',
    unusual_experiences: 'Незвичні враження',
  },
  en: {
    concerts: 'Concerts',
    classical_music: 'Classical music',
    opera_and_ballet: 'Opera and ballet',
    jazz_and_blues: 'Jazz and blues',
    theatre: 'Theatre',
    comedy: 'Comedy',
    museums_and_art: 'Museums and art',
    exhibitions: 'Exhibitions',
    festivals: 'Festivals',
    city_events: 'City events',
    free_events: 'Free events',
    food_and_wine: 'Food and wine',
    markets: 'Markets',
    cinema: 'Cinema',
    cinema_highlights: 'Cinema highlights',
    sports: 'Sports',
    football: 'Football',
    tennis: 'Tennis',
    business_and_tech: 'Business and technology',
    outdoor: 'Outdoors',
    open_air_music: 'Open-air music',
    dj_and_electronic: 'DJs and electronic',
    creative_workshops: 'Creative workshops',
    astronomy: 'Astronomy',
    unusual_experiences: 'Unusual experiences',
  },
} as const;

const rankingLabels: Record<Locale, Record<RankingLevel, string>> = {
  uk: {
    must_go: 'Не пропустити',
    strong_match: 'Дуже цікаво',
    maybe: 'Можливо',
    low_priority: 'Низький пріоритет',
  },
  en: {
    must_go: 'Must go',
    strong_match: 'Strong match',
    maybe: 'Maybe',
    low_priority: 'Low priority',
  },
};

const ticketLabels: Record<Locale, Record<TicketStatus, string>> = {
  uk: {
    unknown: 'Статус квитків не вказано',
    not_on_sale: 'Продаж ще не відкрито',
    presale: 'Передпродаж',
    available: 'Квитки доступні',
    limited: 'Залишилося мало квитків',
    sold_out: 'Квитки розпродано',
    registration_required: 'Потрібна реєстрація',
    free_entry: 'Вільний вхід',
    cancelled: 'Подію скасовано',
  },
  en: {
    unknown: 'Ticket status not specified',
    not_on_sale: 'Not on sale yet',
    presale: 'Presale',
    available: 'Tickets available',
    limited: 'Limited availability',
    sold_out: 'Sold out',
    registration_required: 'Registration required',
    free_entry: 'Free entry',
    cancelled: 'Cancelled',
  },
};

const languageLabels: Record<Locale, Record<string, string>> = {
  uk: { uk: 'українська', en: 'англійська', fr: 'французька', it: 'італійська' },
  en: { uk: 'Ukrainian', en: 'English', fr: 'French', it: 'Italian' },
};

export const categoryIds = Object.keys(categoryLabels.uk);
export const rankingLevels = Object.keys(rankingLabels.uk) as RankingLevel[];
export const ticketStatuses = Object.keys(ticketLabels.uk) as TicketStatus[];

export function categoryLabel(category: string, locale: Locale): string {
  return (
    categoryLabels[locale][category as keyof (typeof categoryLabels)['uk']] ??
    category.replaceAll('_', ' ')
  );
}

export function rankingLabel(level: RankingLevel, locale: Locale): string {
  return rankingLabels[locale][level];
}

export function ticketLabel(status: TicketStatus, locale: Locale): string {
  return ticketLabels[locale][status];
}

export function languageLabel(code: string, locale: Locale): string {
  return languageLabels[locale][code.toLowerCase()] ?? code.toUpperCase();
}
