import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { WatchlistItem } from '../types';

// Mock Tauri invoke for testing
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('WatchlistStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a watchlist item with correct structure', () => {
    const item: WatchlistItem = {
      id: '1',
      title: 'Test Movie',
      mediaType: 'movie',
      status: 'watching',
      posterPath: '/test.jpg',
      tmdbId: 123,
      overview: 'Test overview',
      releaseDate: '2024-01-01',
      rating: 8.5,
      addedDate: Date.now(),
    };

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('mediaType');
    expect(item).toHaveProperty('status');
    expect(item.mediaType).toBe('movie');
    expect(item.status).toBe('watching');
  });

  it('handles TV show item correctly', () => {
    const item: WatchlistItem = {
      id: '2',
      title: 'Test TV Show',
      mediaType: 'tv',
      status: 'plan-to-watch',
      posterPath: '/test.jpg',
      tmdbId: 456,
      overview: 'Test overview',
      releaseDate: '2024-01-01',
      rating: 8.0,
      addedDate: Date.now(),
      currentSeason: 1,
      currentEpisode: 0,
    };

    expect(item.mediaType).toBe('tv');
    expect(item.currentSeason).toBe(1);
    expect(item.currentEpisode).toBe(0);
  });

  it('handles anime item correctly', () => {
    const item: WatchlistItem = {
      id: '3',
      title: 'Test Anime',
      mediaType: 'anime',
      status: 'waiting-for-next-ep',
      posterPath: '/test.jpg',
      tmdbId: 789,
      overview: 'Test overview',
      releaseDate: '2024-01-01',
      rating: 9.0,
      addedDate: Date.now(),
      currentSeason: 1,
      currentEpisode: 5,
    };

    expect(item.mediaType).toBe('anime');
    expect(item.status).toBe('waiting-for-next-ep');
  });

  it('allows updating watchlist item status', () => {
    const item: WatchlistItem = {
      id: '1',
      title: 'Test',
      mediaType: 'movie',
      status: 'plan-to-watch',
      posterPath: '/test.jpg',
      tmdbId: 123,
      overview: 'Test overview',
      releaseDate: '2024-01-01',
      rating: 7.5,
      addedDate: Date.now(),
    };

    const updatedItem = { ...item, status: 'watching' as const };
    expect(updatedItem.status).toBe('watching');
    expect(item.status).toBe('plan-to-watch'); // Original unchanged
  });
});
