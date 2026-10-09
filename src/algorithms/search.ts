// ============================================================
// Search Algorithm
// ============================================================
// Simple keyword-based search across item fields.
// Normalizes text to lowercase and searches across:
//   item name, category, brand, color, location, description
//
// Time Complexity: O(n * m) where n = number of items, m = query tokens
// ============================================================

import { Item } from '../types';

/** Normalize text: lowercase, trim, collapse whitespace */
function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Search items by a text query.
 *
 * Each query word is checked against all searchable fields of each item.
 * An item is included in results if ALL query words match at least one field.
 *
 * @param items   Array of items to search through
 * @param query   The user's search query string
 * @returns       Filtered array of items matching the query
 */
export function searchItems(items: Item[], query: string): Item[] {
  const trimmed = query.trim();
  if (!trimmed) return items; // empty query returns all items

  const queryTokens = normalize(trimmed).split(' ').filter(Boolean);

  return items.filter((item) => {
    // Build a single searchable string from all relevant fields
    const searchableText = normalize(
      [
        item.name,
        item.category,
        item.brand,
        item.color,
        item.location,
        item.description,
        item.type,
      ].join(' ')
    );

    // Every query token must appear somewhere in the searchable text
    return queryTokens.every((token) => searchableText.includes(token));
  });
}
