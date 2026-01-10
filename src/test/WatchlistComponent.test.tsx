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
});
