export type DatePrecision = 'datetime' | 'date' | 'month' | 'range' | 'unknown';
export type RankingLevel = 'must_go' | 'strong_match' | 'maybe' | 'low_priority';
export type TicketStatus =
  | 'unknown'
  | 'not_on_sale'
  | 'presale'
  | 'available'
  | 'limited'
  | 'sold_out'
  | 'registration_required'
  | 'free_entry'
  | 'cancelled';

export interface Venue {
  name: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Pricing {
  currency: string | null;
  minimum: number | null;
  maximum: number | null;
  is_free: boolean;
  is_price_confirmed: boolean;
  notes: string | null;
}

export interface Ticketing {
  status: TicketStatus;
  official_url: string | null;
  sale_starts_at: string | null;
  reservation_required: boolean | null;
}

export interface EventSource {
  url: string;
  name: string;
  type: string;
  trust: string;
  checked_at: string;
  supports: string[];
}

export interface FomoEvent {
  id: string;
  title: string;
  description: string | null;
  categories: string[];
  tags?: string[];
  start_at: string | null;
  end_at: string | null;
  timezone: string | null;
  date_precision: DatePrecision;
  venue: Venue;
  language: { codes: string[]; importance: string; notes: string | null };
  pricing: Pricing;
  ticketing: Ticketing;
  sources: EventSource[];
  ranking: { score: number; level: RankingLevel; reasons: string[] };
  tracking: {
    first_seen_at: string | null;
    last_seen_at: string | null;
    last_verified_at: string | null;
    content_hash: string | null;
  };
  status: string;
}

export interface EventDatabase {
  version: 1;
  generated_at: string | null;
  events: FomoEvent[];
}

export interface FomoRun {
  id: string;
  mode: string;
  started_at: string;
  ended_at: string;
  new_events: number;
  updated_events: number;
  sold_out_events: number;
  cancelled_events: number;
  warnings: string[];
  summary: string;
  changed_files: string[];
}

export interface RunHistory {
  version: 1;
  runs: FomoRun[];
}

export interface SiteMetadata {
  build_timestamp: string | null;
  data_updated_at: string | null;
  repository_name: string;
  repository_url: string;
  report_links: Record<string, string>;
  available_categories: string[];
  available_cities: string[];
}

export interface SiteData {
  version: 1;
  events: EventDatabase;
  run_history: RunHistory;
  metadata: SiteMetadata;
}

export type Horizon = 'all' | 'week' | 'weekend' | 'month';

export interface FilterState {
  text: string;
  category: string;
  city: string;
  freeOnly: boolean;
  ranking: RankingLevel | 'all';
  horizon: Horizon;
  language: string;
  ticketStatus: TicketStatus | 'all';
  newlyDiscovered: boolean;
  majorOnly: boolean;
}
