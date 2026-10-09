// ============================================================
// Sorting Utilities
// ============================================================
// Provides sorting functions for items and match results.
// Uses standard comparison-based sorting.
//
// Time Complexity: O(n log n) for all sort operations
// ============================================================

import { Item, MatchResult, SortOption } from '../types';

/**
 * Sort an array of items by the given criteria.
 *
 * @param items   Array of items to sort (not mutated — returns a new array)
 * @param sortBy  The sorting criterion
 * @returns       A new sorted array
 */
export function sortItems(
  items: Item[],
  sortBy: SortOption,
  matchScores?: Map<string, number>
): Item[] {
  const sorted = [...items];

  switch (sortBy) {
    case 'newest':
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;

    case 'oldest':
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;

    case 'name-asc':
      sorted.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      break;

    case 'name-desc':
      sorted.sort((a, b) =>
        b.name.toLowerCase().localeCompare(a.name.toLowerCase())
      );
      break;

    case 'match-high':
      sorted.sort((a, b) => {
        const scoreA = matchScores?.get(a.id) ?? 0;
        const scoreB = matchScores?.get(b.id) ?? 0;
        return scoreB - scoreA;
      });
      break;

    case 'match-low':
      sorted.sort((a, b) => {
        const scoreA = matchScores?.get(a.id) ?? 0;
        const scoreB = matchScores?.get(b.id) ?? 0;
        return scoreA - scoreB;
      });
      break;

    default:
      break;
  }

  return sorted;
}

/**
 * Sort match results by score.
 *
 * @param results  Array of match results
 * @param order    'high' for highest first, 'low' for lowest first
 * @returns        A new sorted array
 */
export function sortMatchResults(
  results: MatchResult[],
  order: 'high' | 'low' = 'high'
): MatchResult[] {
  const sorted = [...results];
  if (order === 'high') {
    sorted.sort((a, b) => b.matchScore - a.matchScore);
  } else {
    sorted.sort((a, b) => a.matchScore - b.matchScore);
  }
  return sorted;
}
