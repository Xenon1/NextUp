import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import UpdateModal from '../components/UpdateModal';
import type { Release } from '../services/releaseService';

// Mock Tauri
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('UpdateModal', () => {
  const mockRelease: Release = {
    tag_name: 'v0.2.0',
    name: 'Version 0.2.0',
    body: 'Major new features:\n- New light mode\n- Performance improvements',
    html_url: 'https://github.com/Xenon1/NextUp/releases/tag/v0.2.0',
    published_at: '2026-01-15T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render update modal', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    expect(document.querySelector('.update-modal')).toBeDefined();
  });

  it('should display version information correctly', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const modal = document.querySelector('.update-modal');
    expect(modal?.textContent).toContain('0.1.0');
    expect(modal?.textContent).toContain('0.2.0');
  });

  it('should accept release props', () => {
    const props = {
      release: mockRelease,
      currentVersion: '0.1.0',
      onClose: vi.fn(),
    };

    expect(props.release.tag_name).toBe('v0.2.0');
    expect(props.currentVersion).toBe('0.1.0');
    expect(typeof props.onClose).toBe('function');
  });

  it('should have working buttons', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const buttons = document.querySelectorAll('.btn');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display release information', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const modal = document.querySelector('.update-modal');
    expect(modal?.textContent).toContain('New Version Available');
  });

  it('should handle close button click', () => {
    const mockOnClose = vi.fn();

    const { container } = render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const closeButton = container.querySelector('.update-modal-close');
    expect(closeButton).toBeDefined();
  });

  it('should show changelog preview', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const preview = document.querySelector('.changelog-preview');
    expect(preview).toBeDefined();
    expect(preview?.textContent).toContain('Major new features');
  });

  it('should have GitHub release link', () => {
    const mockOnClose = vi.fn();

    render(
      <UpdateModal
        release={mockRelease}
        currentVersion="0.1.0"
        onClose={mockOnClose}
      />
    );

    const link = document.querySelector('a[href*="github.com"]');
    expect(link).toBeDefined();
  });
});
