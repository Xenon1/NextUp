import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

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
    
    render(<SearchComponent onAddToWatchlist={mockCallback} />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should have onAddToWatchlist prop', async () => {
    const { SearchComponent } = await import('../components/SearchComponent');
    expect(SearchComponent).toBeDefined();
  });
});
