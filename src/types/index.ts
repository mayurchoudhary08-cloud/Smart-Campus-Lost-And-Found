// ============================================================
// Smart Campus Lost & Found — Data Types
// ============================================================

/** Categories for lost/found items */
export const CATEGORIES = [
  'Electronics',
  'Books',
  'ID / Cards',
  'Wallet',
  'Keys',
  'Clothing',
  'Accessories',
  'Stationery',
  'Bags',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];

/** Campus locations */
export const LOCATIONS = [
  'Central Library',
  'Canteen',
  'Main Gate',
  'Parking',
  'Computer Lab',
  'Classroom Block A',
  'Classroom Block B',
  'Auditorium',
  'Sports Ground',
  'Hostel',
  'Admin Building',
  'Workshop',
  'Other',
] as const;

export type Location = typeof LOCATIONS[number];

/** Where a found item is currently kept */
export const KEPT_AT_OPTIONS = [
  'Security Office',
  'Department Office',
  'With Me',
  'Lost & Found Desk',
  'Other',
] as const;

/** Item report — the core data model */
export interface Item {
  id: string;
  type: 'lost' | 'found';
  name: string;
  category: Category | string;
  brand: string;
  color: string;
  location: string;
  date: string;        // ISO date string YYYY-MM-DD
  time: string;        // approximate time e.g. "14:30"
  description: string;
  photo: string;       // base64 data-url or empty string
  contact: string;
  status: 'active' | 'resolved';
  keptAt?: string;     // only for found items
  createdAt: string;   // ISO datetime string
}

/** Breakdown of the match score between a lost and found item */
export interface MatchBreakdown {
  category: number;     // max 20
  name: number;         // max 25
  brand: number;        // max 15
  color: number;        // max 10
  location: number;     // max 20
  date: number;         // max 10
  description: number;  // max 10 (bonus — can push total above 100 but capped)
}

/** A scored match result */
export interface MatchResult {
  itemId: string;
  matchScore: number;   // 0-100
  breakdown: MatchBreakdown;
}

/** Strength category derived from score */
export type MatchStrength = 'strong' | 'possible' | 'weak' | 'none';

/** Sort options */
export type SortOption =
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'match-high'
  | 'match-low';

/** Filter state for the browse page */
export interface FilterState {
  type: 'all' | 'lost' | 'found';
  category: string;
  location: string;
  status: 'all' | 'active' | 'resolved';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

/** Helper to get match strength label from score */
export function getMatchStrength(score: number): MatchStrength {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'possible';
  if (score >= 40) return 'weak';
  return 'none';
}
