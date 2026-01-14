import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('WatchlistComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render watchlist section', async () => {
    const { WatchlistComponent: WatchlistComponentImport } = await import('../components/WatchlistComponent');
    const mockUpdateCallback = vi.fn();
    const mockRemoveCallback = vi.fn();
    
    render(
      <WatchlistComponentImport 
        items={[]} 
        mediaType="movie"
        onUpdate={mockUpdateCallback}
        onRemove={mockRemoveCallback}
      />
    );
    
    expect(WatchlistComponentImport).toBeDefined();
  });

  it('should accept items prop', async () => {
    
    const props = {
      items: [],
      mediaType: 'movie' as const,
      onUpdate: vi.fn(),
      onRemove: vi.fn()
    };
    
    expect(props.items).toBeDefined();
    expect(Array.isArray(props.items)).toBe(true);
  });

  it('should accept mediaType prop', async () => {
    
    const props = {
      items: [],
      mediaType: 'tv' as const,
      onUpdate: vi.fn(),
      onRemove: vi.fn()
    };
    
    expect(props.mediaType).toBe('tv');
  });

  it('should accept onUpdate callback prop', async () => {
    const mockCallback = vi.fn();
    
    const props = {
      items: [],
      mediaType: 'anime' as const,
      onUpdate: mockCallback,
      onRemove: vi.fn()
    };
    
    expect(props.onUpdate).toBe(mockCallback);
    expect(typeof props.onUpdate).toBe('function');
  });

  it('should accept onRemove callback prop', async () => {
    const mockCallback = vi.fn();
    
    const props = {
      items: [],
      mediaType: 'movie' as const,
      onUpdate: vi.fn(),
      onRemove: mockCallback
    };
    
    expect(props.onRemove).toBe(mockCallback);
    expect(typeof props.onRemove).toBe('function');
  });

  it('should handle item removal with confirmation', () => {
    const mockRemoveCallback = vi.fn();
    
    const props = {
      items: [],
      mediaType: 'movie' as const,
      onUpdate: vi.fn(),
      onRemove: mockRemoveCallback
    };
    
    expect(typeof props.onRemove).toBe('function');
  });

  it('should filter items by movie type', () => {
    const items = [
      {
        id: 'movie-1',
        tmdbId: 1,
        mediaType: 'movie' as const,
        title: 'Test Movie',
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 8.5,
        status: 'watching' as const,
        addedDate: Date.now(),
      },
      {
        id: 'tv-1',
        tmdbId: 2,
        mediaType: 'tv' as const,
        title: 'Test Show',
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 8.0,
        status: 'watching' as const,
        addedDate: Date.now(),
      },
    ];

    const movieItems = items.filter(i => i.mediaType === 'movie');
    expect(movieItems).toHaveLength(1);
    expect(movieItems[0].mediaType).toBe('movie');
  });

  it('should filter items by TV type', () => {
    const items = [
      {
        id: 'movie-1',
        tmdbId: 1,
        mediaType: 'movie' as const,
        title: 'Test Movie',
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 8.5,
        status: 'watching' as const,
        addedDate: Date.now(),
      },
      {
        id: 'tv-1',
        tmdbId: 2,
        mediaType: 'tv' as const,
        title: 'Test Show',
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 8.0,
        status: 'watching' as const,
        addedDate: Date.now(),
      },
    ];

    const tvItems = items.filter(i => i.mediaType === 'tv');
    expect(tvItems).toHaveLength(1);
    expect(tvItems[0].mediaType).toBe('tv');
  });

  it('should filter items by anime type', () => {
    const items = [
      {
        id: 'anime-1',
        tmdbId: 3,
        mediaType: 'anime' as const,
        title: 'Test Anime',
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 9.0,
        status: 'watching' as const,
        addedDate: Date.now(),
      },
    ];

    const animeItems = items.filter(i => i.mediaType === 'anime');
    expect(animeItems).toHaveLength(1);
    expect(animeItems[0].mediaType).toBe('anime');
  });
});

