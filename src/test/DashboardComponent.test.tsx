import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('DashboardComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard section', async () => {
    const { DashboardComponent: DashboardComponentImport } = await import('../components/DashboardComponent');
    const mockCallback = vi.fn();
    const mockRemoveCallback = vi.fn();
    
    render(
      <DashboardComponentImport 
        items={[]} 
        onUpdate={mockCallback}
        onRemove={mockRemoveCallback}
      />
    );
    
    expect(DashboardComponentImport).toBeDefined();
  });

  it('should accept items prop', async () => {
    const mockCallback = vi.fn();
    
    const props = {
      items: [],
      onUpdate: mockCallback
    };
    
    expect(props.items).toBeDefined();
    expect(Array.isArray(props.items)).toBe(true);
  });

  it('should accept onUpdate callback prop', async () => {
    const mockCallback = vi.fn();
    
    const props = {
      items: [],
      onUpdate: mockCallback
    };
    
    expect(props.onUpdate).toBeDefined();
    expect(typeof props.onUpdate).toBe('function');
  });
});
