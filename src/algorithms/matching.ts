// ============================================================
// Smart Matching Algorithm — DSA Matching Engine
// ============================================================
// This module calculates a match score between a lost item
// and a found item using a simple, explainable, rule-based
// scoring system. No AI or ML is used.
//
// Scoring breakdown (max 100 points + up to 10 bonus):
//   Item Name Match    — up to 25 points
//   Category Match     — 20 points (exact match)
//   Brand Match        — up to 15 points
//   Color Match        — 10 points (exact match)
//   Location Match     — 20 points (exact match)
//   Date Proximity     — up to 10 points
//   Description Words  — up to 10 bonus points
//
// The total is capped at 100.
// ============================================================

import { Item, MatchBreakdown, MatchResult } from '../types';
import { PriorityQueue } from './priorityQueue';

/** Normalize text for comparison: lowercase, trim, collapse whitespace */
function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** Tokenize text into individual words, removing very short words */
function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((w) => w.length > 1);
}

/**
 * Calculate how similar two strings are using word overlap.
 * Returns a value between 0 and 1.
 */
function wordSimilarity(a: string, b: string): number {
  const wordsA = tokenize(a);
  const wordsB = tokenize(b);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  let matches = 0;
  for (const word of wordsA) {
    if (wordsB.some((w) => w.includes(word) || word.includes(w))) {
      matches++;
    }
  }

  // Normalize by the larger set to be fair
  return matches / Math.max(wordsA.length, wordsB.length);
}

/**
 * Calculate the number of days between two dates.
 * Returns a non-negative integer.
 */
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diff = Math.abs(a.getTime() - b.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Core matching function — calculates score between a lost item and a found item.
 *
 * @param lostItem   The lost item report
 * @param foundItem  The found item report
 * @returns          MatchResult with score (0-100) and full breakdown
 */
export function calculateMatchScore(
  lostItem: Item,
  foundItem: Item
): MatchResult {
  const breakdown: MatchBreakdown = {
    category: 0,
    name: 0,
    brand: 0,
    color: 0,
    location: 0,
    date: 0,
    description: 0,
  };

  // --- 1. Item Name Match (max 25 points) ---
  // Uses word similarity to handle partial matches like
  // "Black ASUS Laptop" vs "ASUS Laptop Black"
  const nameSimilarity = wordSimilarity(lostItem.name, foundItem.name);
  breakdown.name = Math.round(nameSimilarity * 25);

  // --- 2. Category Match (max 20 points) ---
  // Exact category match gives full points
  if (
    normalize(lostItem.category) === normalize(foundItem.category)
  ) {
    breakdown.category = 20;
  }

  // --- 3. Brand Match (max 15 points) ---
  // Compare brands — partial credit for partial matches
  if (lostItem.brand && foundItem.brand) {
    const brandSim = wordSimilarity(lostItem.brand, foundItem.brand);
    if (brandSim >= 0.8) {
      breakdown.brand = 15; // strong brand match
    } else if (brandSim >= 0.4) {
      breakdown.brand = 8;  // partial brand match
    }
  }

  // --- 4. Color Match (max 10 points) ---
  if (
    lostItem.color &&
    foundItem.color &&
    normalize(lostItem.color) === normalize(foundItem.color)
  ) {
    breakdown.color = 10;
  }

  // --- 5. Location Match (max 20 points) ---
  if (
    normalize(lostItem.location) === normalize(foundItem.location)
  ) {
    breakdown.location = 20;
  } else {
    // Partial credit if one location contains the other
    const lLoc = normalize(lostItem.location);
    const fLoc = normalize(foundItem.location);
    if (lLoc.includes(fLoc) || fLoc.includes(lLoc)) {
      breakdown.location = 10;
    }
  }

  // --- 6. Date Proximity (max 10 points) ---
  // Closer dates get higher scores; >14 days = 0
  if (lostItem.date && foundItem.date) {
    const days = daysBetween(lostItem.date, foundItem.date);
    if (days <= 1) {
      breakdown.date = 10;
    } else if (days <= 3) {
      breakdown.date = 8;
    } else if (days <= 7) {
      breakdown.date = 5;
    } else if (days <= 14) {
      breakdown.date = 2;
    }
  }

  // --- 7. Description Keyword Match (max 10 bonus points) ---
  if (lostItem.description && foundItem.description) {
    const descSim = wordSimilarity(
      lostItem.description,
      foundItem.description
    );
    breakdown.description = Math.round(descSim * 10);
  }

  // --- Calculate total (capped at 100) ---
  const rawTotal =
    breakdown.name +
    breakdown.category +
    breakdown.brand +
    breakdown.color +
    breakdown.location +
    breakdown.date +
    breakdown.description;

  const matchScore = Math.min(rawTotal, 100);

  return {
    itemId: foundItem.id,
    matchScore,
    breakdown,
  };
}

/**
 * Find all matches for a given item.
 *
 * For a LOST item  → compares against all FOUND items.
 * For a FOUND item → compares against all LOST items.
 *
 * Uses a PriorityQueue (Max Heap) to rank results by score.
 * Only returns matches with score >= 40.
 *
 * @param targetItem    The item to find matches for
 * @param allItems      HashMap (Map<string, Item>) of all items
 * @param minScore      Minimum score to include (default 40)
 * @returns             Array of MatchResults in descending score order
 */
export function findMatches(
  targetItem: Item,
  allItems: Map<string, Item>,
  minScore: number = 40
): MatchResult[] {
  // Determine which items to compare against
  const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';

  // Create a priority queue ordered by match score
  // If scores are equal, prefer the closer date (secondary comparison)
  const pq = new PriorityQueue<MatchResult>((a, b) => {
    if (a.matchScore !== b.matchScore) {
      return a.matchScore - b.matchScore;
    }
    // Secondary: prefer higher date proximity score
    return a.breakdown.date - b.breakdown.date;
  });

  // Iterate through all items and calculate scores
  allItems.forEach((candidate) => {
    // Skip same-type items (don't compare lost with lost)
    if (candidate.type !== oppositeType) return;
    // Skip resolved items
    if (candidate.status === 'resolved') return;
    // Don't match with self
    if (candidate.id === targetItem.id) return;

    const result =
      targetItem.type === 'lost'
        ? calculateMatchScore(targetItem, candidate)
        : calculateMatchScore(candidate, targetItem);

    // itemId should always refer to the matching candidate's ID
    result.itemId = candidate.id;

    // Only insert into priority queue if score meets threshold
    if (result.matchScore >= minScore) {
      pq.insert(result);
    }
  });

  // Extract all matches in priority order (highest score first)
  return pq.toSortedArray();
}
