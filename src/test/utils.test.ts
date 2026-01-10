import { describe, it, expect } from 'vitest';

// Helper function to format status text
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'plan-to-watch': 'Plan to Watch',
    'watching': 'Watching',
    'waiting-for-next-ep': 'Waiting for Next Episode',
    'on-hold': 'On Hold',
    'dropped': 'Dropped',
    'completed': 'Completed',
  };
  return statusMap[status] || status;
}

describe('formatStatus', () => {
  it('formats plan-to-watch status', () => {
    expect(formatStatus('plan-to-watch')).toBe('Plan to Watch');
  });

  it('formats watching status', () => {
    expect(formatStatus('watching')).toBe('Watching');
  });

  it('formats waiting-for-next-ep status', () => {
    expect(formatStatus('waiting-for-next-ep')).toBe('Waiting for Next Episode');
  });

  it('formats on-hold status', () => {
    expect(formatStatus('on-hold')).toBe('On Hold');
  });

  it('formats dropped status', () => {
    expect(formatStatus('dropped')).toBe('Dropped');
  });

  it('formats completed status', () => {
    expect(formatStatus('completed')).toBe('Completed');
  });

  it('returns original string for unknown status', () => {
    expect(formatStatus('unknown')).toBe('unknown');
  });
});
