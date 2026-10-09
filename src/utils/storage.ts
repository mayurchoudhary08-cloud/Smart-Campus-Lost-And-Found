// ============================================================
// Storage Utilities
// ============================================================
// Uses localStorage for item data and IndexedDB for images.
// This separation prevents localStorage from exceeding its ~5MB limit
// when users upload photos.
// ============================================================

import { Item } from '../types';

const ITEMS_KEY = 'smart_campus_items';
const DEMO_LOADED_KEY = 'smart_campus_demo_loaded';

// ---- Item HashMap (localStorage) ----

/**
 * Load all items from localStorage into a Map.
 * The Map provides O(1) average lookup by item ID.
 *
 * @returns Map<itemId, Item>
 */
export function loadItemsMap(): Map<string, Item> {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return new Map();
    const arr: Item[] = JSON.parse(raw);
    const map = new Map<string, Item>();
    for (const item of arr) {
      map.set(item.id, item);
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Save the item Map back to localStorage.
 * Converts Map to array for JSON serialization.
 */
export function saveItemsMap(map: Map<string, Item>): void {
  const arr = Array.from(map.values());
  localStorage.setItem(ITEMS_KEY, JSON.stringify(arr));
}

/**
 * Add a single item to the stored Map.
 * Uses O(1) Map.set() for insertion.
 */
export function addItem(item: Item): void {
  const map = loadItemsMap();
  map.set(item.id, item);
  saveItemsMap(map);
}

/**
 * Update an existing item by ID.
 * Uses O(1) Map.get() + Map.set().
 */
export function updateItem(item: Item): void {
  const map = loadItemsMap();
  if (map.has(item.id)) {
    map.set(item.id, item);
    saveItemsMap(map);
  }
}

/**
 * Get a single item by ID.
 * O(1) average lookup via HashMap.
 */
export function getItemById(id: string): Item | undefined {
  const map = loadItemsMap();
  return map.get(id);
}

/**
 * Delete an item by ID.
 */
export function deleteItem(id: string): void {
  const map = loadItemsMap();
  map.delete(id);
  saveItemsMap(map);
}

/**
 * Get all items as an array.
 */
export function getAllItems(): Item[] {
  const map = loadItemsMap();
  return Array.from(map.values());
}

/**
 * Clear all stored items.
 */
export function clearAllItems(): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify([]));
  localStorage.setItem(DEMO_LOADED_KEY, 'true');
  clearAllImages();
}

/**
 * Check if demo data has been loaded.
 */
export function isDemoLoaded(): boolean {
  return localStorage.getItem(DEMO_LOADED_KEY) === 'true';
}

/**
 * Mark demo data as loaded.
 */
export function setDemoLoaded(): void {
  localStorage.setItem(DEMO_LOADED_KEY, 'true');
}

// ---- Image Storage (IndexedDB) ----

const DB_NAME = 'smart_campus_images';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a photo (base64 data URL) to IndexedDB.
 */
export async function saveImage(itemId: string, dataUrl: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, itemId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load a photo from IndexedDB.
 */
export async function loadImage(itemId: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(itemId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a photo from IndexedDB.
 */
export async function deleteImage(itemId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(itemId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clear all images from IndexedDB.
 */
export async function clearAllImages(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Generate a unique item ID.
 * Format: LF-YYYYMMDD-XXX
 */
export function generateId(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 900 + 100); // 100-999
  return `LF-${dateStr}-${random}`;
}
