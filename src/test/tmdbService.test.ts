import { describe, it, expect, vi, beforeEach } from 'vitest';
import tmdbService from '../services/tmdbService';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
    })),
  },
}));

describe('tmdbService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with an API key', () => {
    const apiKey = 'test-api-key-123';
    tmdbService.setApiKey(apiKey);
    expect(tmdbService).toBeDefined();
  });

  it('should have searchMovies method', () => {
    expect(tmdbService.searchMovies).toBeDefined();
    expect(typeof tmdbService.searchMovies).toBe('function');
  });

  it('should have searchTVShows method', () => {
    expect(tmdbService.searchTVShows).toBeDefined();
    expect(typeof tmdbService.searchTVShows).toBe('function');
  });

  it('should have getMovieDetails method', () => {
    expect(tmdbService.getMovieDetails).toBeDefined();
    expect(typeof tmdbService.getMovieDetails).toBe('function');
  });

  it('should have getTVShowDetails method', () => {
    expect(tmdbService.getTVShowDetails).toBeDefined();
    expect(typeof tmdbService.getTVShowDetails).toBe('function');
  });

  it('should have getTVShowWithSeasons method', () => {
    expect(tmdbService.getTVShowWithSeasons).toBeDefined();
    expect(typeof tmdbService.getTVShowWithSeasons).toBe('function');
  });

  it('should have setApiKey method', () => {
    expect(tmdbService.setApiKey).toBeDefined();
    expect(typeof tmdbService.setApiKey).toBe('function');
  });
});
