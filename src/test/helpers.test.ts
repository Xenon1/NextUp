import { describe, it, expect } from 'vitest';
import type { WatchlistItem } from '../types';

// Helper functions for common operations
export function calculateItemProgress(currentEpisode: number, totalEpisodes: number): number {
  if (totalEpisodes === 0) return 0;
  return Math.round((currentEpisode / totalEpisodes) * 100);
}

export function getItemsByStatus(items: WatchlistItem[], status: string): WatchlistItem[] {
  return items.filter(item => item.status === status);
}

export function sortItemsByDate(items: WatchlistItem[], ascending = true): WatchlistItem[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.addedDate).getTime();
    const dateB = new Date(b.addedDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function formatDate(date: number | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

describe('Helper Utils', () => {
  describe('calculateItemProgress', () => {
    it('should calculate 50% progress', () => {
      expect(calculateItemProgress(5, 10)).toBe(50);
    });

    it('should calculate 100% progress', () => {
      expect(calculateItemProgress(10, 10)).toBe(100);
    });

    it('should calculate 0% progress', () => {
      expect(calculateItemProgress(0, 10)).toBe(0);
    });

    it('should handle zero total episodes', () => {
      expect(calculateItemProgress(5, 0)).toBe(0);
    });

    it('should round progress correctly', () => {
      expect(calculateItemProgress(1, 3)).toBe(33);
    });
  });

  describe('getItemsByStatus', () => {
    const items: WatchlistItem[] = [
      { id: '1', tmdbId: 1, mediaType: 'movie', title: 'Movie 1', status: 'watching', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704067200000 },
      { id: '2', tmdbId: 2, mediaType: 'tv', title: 'TV 1', status: 'plan-to-watch', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704153600000 },
      { id: '3', tmdbId: 3, mediaType: 'movie', title: 'Movie 2', status: 'watching', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704240000000 },
    ];

    it('should filter items by status', () => {
      const result = getItemsByStatus(items, 'watching');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('should return empty array for non-existent status', () => {
      const result = getItemsByStatus(items, 'completed');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortItemsByDate', () => {
    const items: WatchlistItem[] = [
      { id: '1', tmdbId: 1, mediaType: 'movie', title: 'Movie 1', status: 'watching', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704240000000 },
      { id: '2', tmdbId: 2, mediaType: 'tv', title: 'TV 1', status: 'plan-to-watch', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704067200000 },
      { id: '3', tmdbId: 3, mediaType: 'movie', title: 'Movie 2', status: 'watching', posterPath: '/path', overview: 'Test', releaseDate: '2024-01-01', rating: 8, addedDate: 1704153600000 },
    ];

    it('should sort items ascending by date', () => {
      const result = sortItemsByDate(items, true);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
    });

    it('should sort items descending by date', () => {
      const result = sortItemsByDate(items, false);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('2');
    });

    it('should not modify original array', () => {
      const original = [...items];
      sortItemsByDate(items, true);
      expect(items).toEqual(original);
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format timestamp correctly', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });
});
