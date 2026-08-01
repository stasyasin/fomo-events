export const supportedLocales = ['uk', 'en'] as const;

export type Locale = (typeof supportedLocales)[number];

const localeStorageKey = 'fomo-events-locale';

const translations = {
  uk: {
    languageSwitcher: 'Мова сайту',
    languageUk: 'Українська',
    languageEn: 'English',
    radar: 'Лазурний радар',
    lede: 'Події, які шкода пропустити на Лазурному узбережжі.',
    dataUpdated: 'Дані оновлено: {value}',
    quickViews: 'Швидкі добірки',
    quickAll: 'Усі події',
    quickMustGo: 'Не пропустити',
    quickFree: 'Безкоштовні',
    quickWeek: 'Цього тижня',
    quickWeekend: 'Цими вихідними',
    quickNew: 'Нові',
    quickMajor: 'Великі події',
    eventCollection: 'Добірка подій',
    collection: 'Добірка',
    eventsFound: 'Знайдено: {count}',
    firstScanTitle: 'Події з’являться після першого сканування',
    filters: 'Відфільтрувати',
    clear: 'Очистити',
    search: 'Пошук',
    searchPlaceholder: 'Артист, місце, тема…',
    category: 'Категорія',
    allCategories: 'Усі категорії',
    city: 'Місто',
    allCities: 'Усі міста',
    when: 'Коли',
    allFutureDates: 'Усі майбутні дати',
    nextSevenDays: 'Наступні 7 днів',
    thisWeekend: 'Ці вихідні',
    laterThisMonth: 'Пізніше цього місяця',
    matchLevel: 'Рівень збігу',
    allLevels: 'Усі рівні',
    language: 'Мова',
    anyLanguage: 'Будь-яка мова',
    tickets: 'Квитки',
    anyTicketStatus: 'Будь-який статус',
    onlyFree: 'Лише безкоштовні',
    groupNextSeven: 'Наступні сім днів',
    groupLaterThisMonth: 'Пізніше цього місяця',
    groupComingMonths: 'Найближчі місяці',
    groupUnknownDate: 'Дата ще не підтверджена',
    locationUnknown: 'Місце уточнюється',
    rankingUnknown: 'Рівень не вказано',
    ticketsUnknown: 'Статус квитків не вказано',
    free: 'Безкоштовно',
    languageUnknown: 'Мову не вказано',
    categories: 'Категорії',
    whyMatch: 'Чому це може підійти',
    source: 'Джерело',
    sourceMissing: 'Посилання на джерело не вказано',
    addToCalendar: 'Додати в календар',
    verifiedAt: 'Дата перевірки: {value}',
    emptyFirstScanTitle: 'Поки що тут тихо',
    emptyFirstScanBody:
      'Перший повний скан FOMO Agent ще не завершено. Коли в канонічній базі з’являться перевірені події, вони автоматично з’являться тут.',
    emptyNoResultsTitle: 'Нічого не збіглося з фільтрами',
    emptyNoResultsBody:
      'Спробуйте очистити або змінити фільтри. Ми не показуємо вигаданих подій замість чесної порожньої добірки.',
    updates: 'Оновлення',
    noScansTitle: 'Ще не було жодного сканування',
    noScansBody: 'Історія перевірок з’явиться тут після першого запуску FOMO Agent.',
    collectionChanges: 'Як змінювалася добірка',
    newEvents: 'Нових: {count}',
    updatedEvents: 'Оновлено: {count}',
    soldOutCancelled: 'Розпродано / скасовано: {count}',
    warning: 'Попередження: {value}',
    openReport: 'Відкрити звіт на GitHub ↗',
    footerSource:
      'Створено на основі FOMO Agent. Дані походять із публічних джерел; перед поїздкою або купівлею квитків перевірте деталі на офіційному сайті.',
    footerPrivacy: 'Без трекерів, реклами чи персональних даних · код і дані проєкту',
    dateUnknown: 'Дата уточнюється',
    neverUpdated: 'ще не оновлювали',
    updatedAtUnknown: 'дата оновлення не вказана',
    priceUnknown: 'Ціну не вказано',
    currencyUnknown: 'валюту не вказано',
  },
  en: {
    languageSwitcher: 'Site language',
    languageUk: 'Українська',
    languageEn: 'English',
    radar: 'Côte d’Azur radar',
    lede: 'Events worth catching on the French Riviera.',
    dataUpdated: 'Data updated: {value}',
    quickViews: 'Quick views',
    quickAll: 'All events',
    quickMustGo: 'Must go',
    quickFree: 'Free',
    quickWeek: 'This week',
    quickWeekend: 'This weekend',
    quickNew: 'New',
    quickMajor: 'Major events',
    eventCollection: 'Event selection',
    collection: 'Selection',
    eventsFound: 'Found: {count}',
    firstScanTitle: 'Events will appear after the first scan',
    filters: 'Filter events',
    clear: 'Clear',
    search: 'Search',
    searchPlaceholder: 'Artist, place, topic…',
    category: 'Category',
    allCategories: 'All categories',
    city: 'City',
    allCities: 'All cities',
    when: 'When',
    allFutureDates: 'All future dates',
    nextSevenDays: 'Next 7 days',
    thisWeekend: 'This weekend',
    laterThisMonth: 'Later this month',
    matchLevel: 'Match level',
    allLevels: 'All levels',
    language: 'Language',
    anyLanguage: 'Any language',
    tickets: 'Tickets',
    anyTicketStatus: 'Any status',
    onlyFree: 'Free only',
    groupNextSeven: 'Next seven days',
    groupLaterThisMonth: 'Later this month',
    groupComingMonths: 'Coming months',
    groupUnknownDate: 'Date not yet confirmed',
    locationUnknown: 'Location to be confirmed',
    rankingUnknown: 'Match level not specified',
    ticketsUnknown: 'Ticket status not specified',
    free: 'Free',
    languageUnknown: 'Language not specified',
    categories: 'Categories',
    whyMatch: 'Why this may suit you',
    source: 'Source',
    sourceMissing: 'No source link provided',
    addToCalendar: 'Add to calendar',
    verifiedAt: 'Last verified: {value}',
    emptyFirstScanTitle: 'Nothing here just yet',
    emptyFirstScanBody:
      'The first full FOMO Agent scan has not finished yet. Verified events will appear here automatically once they are in the canonical database.',
    emptyNoResultsTitle: 'No events match these filters',
    emptyNoResultsBody:
      'Try clearing or changing the filters. We do not show invented events in place of an honest empty selection.',
    updates: 'Updates',
    noScansTitle: 'No scans yet',
    noScansBody: 'The history of checks will appear here after the first FOMO Agent run.',
    collectionChanges: 'How the selection has changed',
    newEvents: 'New: {count}',
    updatedEvents: 'Updated: {count}',
    soldOutCancelled: 'Sold out / cancelled: {count}',
    warning: 'Warning: {value}',
    openReport: 'Open report on GitHub ↗',
    footerSource:
      'Built with FOMO Agent. Data comes from public sources; check the official website before travelling or buying tickets.',
    footerPrivacy: 'No trackers, ads, or personal data · project code and data',
    dateUnknown: 'Date to be confirmed',
    neverUpdated: 'not updated yet',
    updatedAtUnknown: 'update date not specified',
    priceUnknown: 'Price not specified',
    currencyUnknown: 'currency not specified',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof translations)['uk'];

export function translate(
  locale: Locale,
  key: TranslationKey,
  replacements: Record<string, string | number> = {},
): string {
  return translations[locale][key].replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const replacement = replacements[name];
    return replacement === undefined ? placeholder : String(replacement);
  });
}

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (supportedLocales as readonly string[]).includes(value);
}

function storageLocale(): Locale | undefined {
  try {
    const value = window.localStorage.getItem(localeStorageKey) ?? undefined;
    return isLocale(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function localeFromSearch(search = window.location.search): Locale {
  const requested = new URLSearchParams(search).get('lang') ?? undefined;
  if (isLocale(requested)) return requested;
  const saved = storageLocale();
  if (saved) return saved;
  return window.navigator.language.toLowerCase().startsWith('uk') ? 'uk' : 'en';
}

export function saveLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // A blocked storage API should not prevent changing the visible language.
  }
}
