// ============================================================
// Smart Campus Lost & Found — Unit Tests
// ============================================================

import { describe, it, expect } from 'vitest';
import { PriorityQueue } from '../algorithms/priorityQueue';
import { calculateMatchScore, findMatches } from '../algorithms/matching';
import { searchItems } from '../algorithms/search';
import { sortItems } from '../algorithms/sorting';
import { Item } from '../types';

// ---- Helper: create a test item ----
function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'TEST-001',
    type: 'lost',
    name: 'Black ASUS Laptop',
    category: 'Electronics',
    brand: 'ASUS',
    color: 'Black',
    location: 'Central Library',
    date: '2026-09-28',
    time: '14:00',
    description: 'Black ASUS laptop with a small sticker near the keyboard',
    photo: '',
    contact: 'test@college.edu',
    status: 'active',
    createdAt: '2026-09-28T14:00:00Z',
    ...overrides,
  };
}

// ============================================================
// Priority Queue Tests
// ============================================================
describe('PriorityQueue (Max Heap)', () => {
  it('should insert and extract elements in priority order', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.insert(45);
    pq.insert(92);
    pq.insert(63);
    pq.insert(81);

    expect(pq.size()).toBe(4);
    expect(pq.extractMax()).toBe(92);
    expect(pq.extractMax()).toBe(81);
    expect(pq.extractMax()).toBe(63);
    expect(pq.extractMax()).toBe(45);
  });

  it('should return undefined from empty queue', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    expect(pq.extractMax()).toBeUndefined();
    expect(pq.peek()).toBeUndefined();
    expect(pq.isEmpty()).toBe(true);
  });

  it('should peek without removing', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.insert(10);
    pq.insert(50);
    pq.insert(30);

    expect(pq.peek()).toBe(50);
    expect(pq.size()).toBe(3); // size unchanged
  });

  it('should handle single element', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.insert(42);
    expect(pq.size()).toBe(1);
    expect(pq.extractMax()).toBe(42);
    expect(pq.isEmpty()).toBe(true);
  });

  it('should work with objects using custom comparator', () => {
    interface Scored { name: string; score: number }
    const pq = new PriorityQueue<Scored>((a, b) => a.score - b.score);
    pq.insert({ name: 'A', score: 85 });
    pq.insert({ name: 'B', score: 92 });
    pq.insert({ name: 'C', score: 74 });

    expect(pq.extractMax()?.name).toBe('B');
    expect(pq.extractMax()?.name).toBe('A');
    expect(pq.extractMax()?.name).toBe('C');
  });

  it('toSortedArray should return all elements sorted without destroying heap', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.insert(30);
    pq.insert(10);
    pq.insert(50);
    pq.insert(20);

    const sorted = pq.toSortedArray();
    expect(sorted).toEqual([50, 30, 20, 10]);
    expect(pq.size()).toBe(4); // original heap intact
  });

  it('should handle duplicate values', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.insert(50);
    pq.insert(50);
    pq.insert(50);

    expect(pq.extractMax()).toBe(50);
    expect(pq.extractMax()).toBe(50);
    expect(pq.extractMax()).toBe(50);
    expect(pq.isEmpty()).toBe(true);
  });
});

// ============================================================
// Matching Algorithm Tests
// ============================================================
describe('calculateMatchScore', () => {
  it('should return high score for near-identical items', () => {
    const lost = makeItem({ type: 'lost' });
    const found = makeItem({
      id: 'TEST-002',
      type: 'found',
      date: '2026-09-29',
      createdAt: '2026-09-29T10:00:00Z',
    });

    const result = calculateMatchScore(lost, found);
    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.breakdown.category).toBe(20);
    expect(result.breakdown.brand).toBe(15);
    expect(result.breakdown.color).toBe(10);
    expect(result.breakdown.location).toBe(20);
  });

  it('should return low score for different items', () => {
    const lost = makeItem({ type: 'lost' });
    const found = makeItem({
      id: 'TEST-003',
      type: 'found',
      name: 'Red Umbrella',
      category: 'Accessories',
      brand: '',
      color: 'Red',
      location: 'Main Gate',
      date: '2026-10-05',
      description: 'A red folding umbrella',
    });

    const result = calculateMatchScore(lost, found);
    expect(result.matchScore).toBeLessThan(40);
  });

  it('should give partial name score for overlapping words', () => {
    const lost = makeItem({ type: 'lost', name: 'Black ASUS Laptop' });
    const found = makeItem({
      id: 'TEST-004',
      type: 'found',
      name: 'Black Dell Laptop',
      brand: 'Dell',
    });

    const result = calculateMatchScore(lost, found);
    // "Black" and "Laptop" match, but "ASUS" vs "Dell" don't
    expect(result.breakdown.name).toBeGreaterThan(0);
    expect(result.breakdown.name).toBeLessThan(25);
  });

  it('should handle missing brand gracefully', () => {
    const lost = makeItem({ type: 'lost', brand: '' });
    const found = makeItem({
      id: 'TEST-005',
      type: 'found',
      brand: 'ASUS',
    });

    const result = calculateMatchScore(lost, found);
    expect(result.breakdown.brand).toBe(0);
  });

  it('should give date score based on proximity', () => {
    const lost = makeItem({ type: 'lost', date: '2026-09-28' });
    const found = makeItem({
      id: 'TEST-006',
      type: 'found',
      date: '2026-09-29',
    });

    const result = calculateMatchScore(lost, found);
    expect(result.breakdown.date).toBe(10); // 1 day apart
  });

  it('should cap total score at 100', () => {
    const lost = makeItem({ type: 'lost' });
    const found = makeItem({
      id: 'TEST-007',
      type: 'found',
      date: '2026-09-28',
      description: 'Black ASUS laptop with a small sticker near the keyboard',
    });

    const result = calculateMatchScore(lost, found);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });
});

// ============================================================
describe('searchItems', () => {
  const items: Item[] = [
    makeItem({ id: 'S1', name: 'Black ASUS Laptop', category: 'Electronics', brand: 'ASUS', color: 'Black', description: 'ASUS gaming laptop in black color' }),
    makeItem({ id: 'S2', name: 'Blue Backpack', category: 'Bags', brand: 'Skybags', color: 'Blue', location: 'Canteen', description: 'School bag left in canteen' }),
    makeItem({ id: 'S3', name: 'Student ID Card', category: 'ID / Cards', brand: '', color: 'White', location: 'Classroom Block A', description: 'College identity card with lanyard' }),
    makeItem({ id: 'S4', name: 'Red Umbrella', category: 'Accessories', brand: '', color: 'Red', location: 'Main Gate', description: 'Foldable umbrella near security gate' }),
  ];

  it('should return all items for empty query', () => {
    expect(searchItems(items, '')).toHaveLength(4);
    expect(searchItems(items, '   ')).toHaveLength(4);
  });

  it('should find items by name', () => {
    const results = searchItems(items, 'laptop');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('S1');
  });

  it('should find items by color', () => {
    const results = searchItems(items, 'blue');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('S2');
  });

  it('should find items by location', () => {
    const results = searchItems(items, 'canteen');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('S2');
  });

  it('should handle multi-word queries (AND logic)', () => {
    const results = searchItems(items, 'black laptop');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('S1');
  });

  it('should be case insensitive', () => {
    const results = searchItems(items, 'ASUS');
    expect(results).toHaveLength(1);
  });

  it('should return empty for no matches', () => {
    const results = searchItems(items, 'xyznonexistent');
    expect(results).toHaveLength(0);
  });
});

// ============================================================
// Sorting Tests
// ============================================================
describe('sortItems', () => {
  const items: Item[] = [
    makeItem({ id: 'T1', name: 'Charlie', createdAt: '2026-09-27T10:00:00Z' }),
    makeItem({ id: 'T2', name: 'Alpha', createdAt: '2026-09-29T10:00:00Z' }),
    makeItem({ id: 'T3', name: 'Beta', createdAt: '2026-09-28T10:00:00Z' }),
  ];

  it('should sort by newest first', () => {
    const sorted = sortItems(items, 'newest');
    expect(sorted[0].id).toBe('T2');
    expect(sorted[2].id).toBe('T1');
  });

  it('should sort by oldest first', () => {
    const sorted = sortItems(items, 'oldest');
    expect(sorted[0].id).toBe('T1');
    expect(sorted[2].id).toBe('T2');
  });

  it('should sort by name A-Z', () => {
    const sorted = sortItems(items, 'name-asc');
    expect(sorted[0].name).toBe('Alpha');
    expect(sorted[1].name).toBe('Beta');
    expect(sorted[2].name).toBe('Charlie');
  });

  it('should sort by name Z-A', () => {
    const sorted = sortItems(items, 'name-desc');
    expect(sorted[0].name).toBe('Charlie');
    expect(sorted[2].name).toBe('Alpha');
  });

  it('should not mutate the original array', () => {
    const original = [...items];
    sortItems(items, 'newest');
    expect(items[0].id).toBe(original[0].id);
  });

  it('should sort by match-high and match-low', () => {
    const scoreMap = new Map<string, number>();
    scoreMap.set('T1', 30);
    scoreMap.set('T2', 90);
    scoreMap.set('T3', 60);

    const highSorted = sortItems(items, 'match-high', scoreMap);
    expect(highSorted[0].id).toBe('T2');
    expect(highSorted[1].id).toBe('T3');
    expect(highSorted[2].id).toBe('T1');

    const lowSorted = sortItems(items, 'match-low', scoreMap);
    expect(lowSorted[0].id).toBe('T1');
    expect(lowSorted[1].id).toBe('T3');
    expect(lowSorted[2].id).toBe('T2');
  });
});

// ============================================================
// Matching with PriorityQueue (findMatches) Tests
// ============================================================
describe('findMatches using PriorityQueue', () => {
  it('should find matching found items for a lost item and return in priority order', () => {
    const lostItem = makeItem({
      id: 'L1',
      type: 'lost',
      name: 'Black ASUS Laptop',
      category: 'Electronics',
      brand: 'ASUS',
      color: 'Black',
      location: 'Central Library',
      date: '2026-09-28',
    });

    const highMatchFound = makeItem({
      id: 'F1',
      type: 'found',
      name: 'Black ASUS Laptop',
      category: 'Electronics',
      brand: 'ASUS',
      color: 'Black',
      location: 'Central Library',
      date: '2026-09-29',
    });

    const partialMatchFound = makeItem({
      id: 'F2',
      type: 'found',
      name: 'Black Dell Laptop',
      category: 'Electronics',
      brand: 'Dell',
      color: 'Black',
      location: 'Computer Lab',
      date: '2026-09-29',
    });

    const differentFound = makeItem({
      id: 'F3',
      type: 'found',
      name: 'Red Umbrella',
      category: 'Accessories',
      brand: '',
      color: 'Red',
      location: 'Main Gate',
      date: '2026-09-28',
    });

    const itemsMap = new Map<string, Item>();
    itemsMap.set(lostItem.id, lostItem);
    itemsMap.set(highMatchFound.id, highMatchFound);
    itemsMap.set(partialMatchFound.id, partialMatchFound);
    itemsMap.set(differentFound.id, differentFound);

    const matches = findMatches(lostItem, itemsMap);
    // Should return highMatchFound first (extracted from max heap)
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].itemId).toBe('F1');
    expect(matches[0].matchScore).toBeGreaterThanOrEqual(80);
    // F3 should not be included (score < 40)
    expect(matches.some((m) => m.itemId === 'F3')).toBe(false);
  });

  it('should correctly set itemId to candidate ID when searching for matches of a found item', () => {
    const foundItem = makeItem({
      id: 'F10',
      type: 'found',
      name: 'Blue JanSport Backpack',
      category: 'Bags',
      brand: 'JanSport',
      color: 'Blue',
      location: 'Canteen',
      date: '2026-09-26',
    });

    const lostItem = makeItem({
      id: 'L10',
      type: 'lost',
      name: 'Blue Backpack',
      category: 'Bags',
      brand: '',
      color: 'Blue',
      location: 'Canteen',
      date: '2026-09-25',
    });

    const itemsMap = new Map<string, Item>();
    itemsMap.set(foundItem.id, foundItem);
    itemsMap.set(lostItem.id, lostItem);

    const matches = findMatches(foundItem, itemsMap);
    expect(matches.length).toBe(1);
    expect(matches[0].itemId).toBe('L10'); // Must be the matched lost item ID
  });

  it('should not match resolved items', () => {
    const lostItem = makeItem({ id: 'L20', type: 'lost', name: 'Keys' });
    const resolvedFound = makeItem({
      id: 'F20',
      type: 'found',
      name: 'Keys',
      status: 'resolved',
    });

    const itemsMap = new Map<string, Item>();
    itemsMap.set(lostItem.id, lostItem);
    itemsMap.set(resolvedFound.id, resolvedFound);

    const matches = findMatches(lostItem, itemsMap);
    expect(matches).toHaveLength(0);
  });
});

