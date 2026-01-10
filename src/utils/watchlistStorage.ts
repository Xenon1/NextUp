import type { WatchlistItem } from '../types';
import { invoke } from '@tauri-apps/api/core';

let cachedItems: WatchlistItem[] | null = null;

const loadFromDisk = async (): Promise<WatchlistItem[]> => {
  if (cachedItems !== null) {
    return cachedItems;
  }
  
  try {
    const data = await invoke<string>('load_watchlist');
    cachedItems = JSON.parse(data);
    return cachedItems || [];
  } catch (error) {
    console.error('Error loading watchlist from disk:', error);
    cachedItems = [];
    return [];
  }
};

const saveToDisk = async (items: WatchlistItem[]): Promise<void> => {
  try {
    cachedItems = items;
    await invoke('save_watchlist', { data: JSON.stringify(items) });
  } catch (error) {
    console.error('Error saving watchlist to disk:', error);
  }
};

export const WatchlistStorage = {
  // Get all items
  getAll: async (): Promise<WatchlistItem[]> => {
    return loadFromDisk();
  },

  // Add or update an item
  save: async (item: WatchlistItem): Promise<void> => {
    const items = await loadFromDisk();
    const existingIndex = items.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    
    await saveToDisk(items);
  },

  // Remove an item
  remove: async (id: string): Promise<void> => {
    const items = await loadFromDisk();
    const filtered = items.filter(i => i.id !== id);
    await saveToDisk(filtered);
  },

  // Get item by ID
  getById: async (id: string): Promise<WatchlistItem | undefined> => {
    const items = await loadFromDisk();
    return items.find(i => i.id === id);
  },

  // Get items by status
  getByStatus: async (status: 'plan-to-watch' | 'watching' | 'waiting-for-next-ep' | 'on-hold' | 'dropped' | 'completed'): Promise<WatchlistItem[]> => {
    const items = await loadFromDisk();
    return items.filter(i => i.status === status);
  },

  // Get items by type
  getByType: async (mediaType: 'movie' | 'tv' | 'anime'): Promise<WatchlistItem[]> => {
    const items = await loadFromDisk();
    return items.filter(i => i.mediaType === mediaType);
  },

  // Clear all
  clear: async (): Promise<void> => {
    await saveToDisk([]);
  },
};
