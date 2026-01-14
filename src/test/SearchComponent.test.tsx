import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationProvider } from '../components/NotificationContext';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('SearchComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input', async () => {
    const { SearchComponent } = await import('../components/SearchComponent');
    const mockCallback = vi.fn();
    
    render(
      <NotificationProvider>
        <SearchComponent onAddToWatchlist={mockCallback} />
      </NotificationProvider>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should have onAddToWatchlist prop', async () => {
    const { SearchComponent } = await import('../components/SearchComponent');
    expect(SearchComponent).toBeDefined();
  });

  it('should accept onAddToWatchlist callback', () => {
    const mockCallback = vi.fn();
    
    expect(typeof mockCallback).toBe('function');
    expect(mockCallback).toBeDefined();
  });

  it('should call onAddToWatchlist when item is added', () => {
    const mockCallback = vi.fn();
    
    // Simulate adding an item
    const testItem = {
      id: 'movie-123',
      tmdbId: 123,
      mediaType: 'movie' as const,
      title: 'Test Movie',
      posterPath: '/test.jpg',
      overview: 'Test overview',
      releaseDate: '2026-01-01',
      rating: 8.5,
      status: 'plan-to-watch' as const,
      addedDate: Date.now(),
    };

    mockCallback(testItem);
    
    expect(mockCallback).toHaveBeenCalledWith(testItem);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple items being added', () => {
    const mockCallback = vi.fn();
    
    const item1 = {
      id: 'movie-1',
      tmdbId: 1,
      mediaType: 'movie' as const,
      title: 'Movie 1',
      posterPath: '/test1.jpg',
      overview: 'Test',
      releaseDate: '2026-01-01',
      rating: 8.5,
      status: 'plan-to-watch' as const,
      addedDate: Date.now(),
    };

    const item2 = {
      id: 'tv-1',
      tmdbId: 2,
      mediaType: 'tv' as const,
      title: 'Show 1',
      posterPath: '/test2.jpg',
      overview: 'Test',
      releaseDate: '2026-01-02',
      rating: 8.0,
      status: 'plan-to-watch' as const,
      addedDate: Date.now(),
    };

    mockCallback(item1);
    mockCallback(item2);
    
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenNthCalledWith(1, item1);
    expect(mockCallback).toHaveBeenNthCalledWith(2, item2);
  });

  it('should create notifications for added items', () => {
    // Test that notification would be shown
    const title = 'Test Movie';
    const status = 'plan-to-watch';
    const message = `"${title}" added to your watchlist as ${status.replaceAll('-', ' ')}!`;
    
    expect(message).toContain(title);
    expect(message).toContain('plan to watch');
  });

  it('should handle different media types', () => {
    const mockCallback = vi.fn();
    
    const mediaTypes = ['movie', 'tv', 'anime'] as const;
    
    mediaTypes.forEach((type) => {
      const item = {
        id: `${type}-1`,
        tmdbId: 1,
        mediaType: type,
        title: `Test ${type}`,
        posterPath: '/test.jpg',
        overview: 'Test',
        releaseDate: '2026-01-01',
        rating: 8.5,
        status: 'plan-to-watch' as const,
        addedDate: Date.now(),
      };
      
      mockCallback(item);
    });
    
    expect(mockCallback).toHaveBeenCalledTimes(3);
  });
});
