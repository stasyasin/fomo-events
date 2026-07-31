import type { EventDatabase, RunHistory, SiteData, SiteMetadata } from './types.js';

function emptyData(): SiteData {
  return {
    version: 1,
    events: { version: 1, generated_at: null, events: [] },
    run_history: { version: 1, runs: [] },
    metadata: {
      build_timestamp: null,
      data_updated_at: null,
      repository_name: 'fomo-events',
      repository_url: 'https://github.com/stasyasin/fomo-events',
      report_links: {},
      available_categories: [],
      available_cities: [],
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parsedData(value: unknown): SiteData {
  if (
    !isRecord(value) ||
    !isRecord(value.events) ||
    !isRecord(value.run_history) ||
    !isRecord(value.metadata)
  ) {
    return emptyData();
  }
  const fallback = emptyData();
  return {
    version: 1,
    events: {
      version: 1,
      generated_at:
        typeof value.events.generated_at === 'string'
          ? value.events.generated_at
          : fallback.events.generated_at,
      events: asArray<EventDatabase['events'][number]>(value.events.events),
    },
    run_history: {
      version: 1,
      runs: asArray<RunHistory['runs'][number]>(value.run_history.runs),
    },
    metadata: {
      build_timestamp:
        typeof value.metadata.build_timestamp === 'string' ? value.metadata.build_timestamp : null,
      data_updated_at:
        typeof value.metadata.data_updated_at === 'string' ? value.metadata.data_updated_at : null,
      repository_name:
        typeof value.metadata.repository_name === 'string'
          ? value.metadata.repository_name
          : fallback.metadata.repository_name,
      repository_url:
        typeof value.metadata.repository_url === 'string'
          ? value.metadata.repository_url
          : fallback.metadata.repository_url,
      report_links: isRecord(value.metadata.report_links)
        ? (value.metadata.report_links as SiteMetadata['report_links'])
        : {},
      available_categories: asArray<string>(value.metadata.available_categories),
      available_cities: asArray<string>(value.metadata.available_cities),
    },
  };
}

export async function loadSiteData(): Promise<SiteData> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}generated/site-data.json`);
    if (!response.ok) return emptyData();
    return parsedData((await response.json()) as unknown);
  } catch {
    return emptyData();
  }
}
