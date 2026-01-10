import { describe, it, expect } from 'vitest';
import type { WatchlistItem } from '../types';

// Test data validation utility
export function validateWatchlistItem(item: WatchlistItem): boolean {
  const required = ['id', 'title', 'mediaType', 'status', 'tmdbId', 'overview', 'releaseDate', 'rating', 'addedDate'];
  return required.every(field => field in item);
}

// Test status validation
export function isValidStatus(status: string): boolean {
  const validStatuses = ['plan-to-watch', 'watching', 'waiting-for-next-ep', 'on-hold', 'dropped', 'completed'];
  return validStatuses.includes(status);
}

// Test media type validation
export function isValidMediaType(mediaType: string): boolean {
  const validTypes = ['movie', 'tv', 'anime'];
  return validTypes.includes(mediaType);
}

describe('Validation Utils', () => {
  describe('validateWatchlistItem', () => {
    it('should validate complete watchlist item', () => {
      const item = {
        id: '1',
        title: 'Test',
        mediaType: 'movie',
        status: 'watching',
        tmdbId: 123,
        overview: 'Test',
        releaseDate: '2024-01-01',
        rating: 8,
        addedDate: Date.now(),
      };
      
      expect(validateWatchlistItem(item)).toBe(true);
    });

    it('should reject incomplete watchlist item', () => {
      const item = {
        id: '1',
        title: 'Test',
      };
      
      expect(validateWatchlistItem(item)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should validate plan-to-watch status', () => {
      expect(isValidStatus('plan-to-watch')).toBe(true);
    });

    it('should validate watching status', () => {
      expect(isValidStatus('watching')).toBe(true);
    });

    it('should validate waiting-for-next-ep status', () => {
      expect(isValidStatus('waiting-for-next-ep')).toBe(true);
    });

    it('should validate on-hold status', () => {
      expect(isValidStatus('on-hold')).toBe(true);
    });

    it('should validate dropped status', () => {
      expect(isValidStatus('dropped')).toBe(true);
    });

    it('should validate completed status', () => {
      expect(isValidStatus('completed')).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(isValidStatus('invalid-status')).toBe(false);
    });
  });

  describe('isValidMediaType', () => {
    it('should validate movie type', () => {
      expect(isValidMediaType('movie')).toBe(true);
    });

    it('should validate tv type', () => {
      expect(isValidMediaType('tv')).toBe(true);
    });

    it('should validate anime type', () => {
      expect(isValidMediaType('anime')).toBe(true);
    });

    it('should reject invalid media type', () => {
      expect(isValidMediaType('invalid-type')).toBe(false);
    });
  });
});
