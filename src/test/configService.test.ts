import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Tauri invoke
const mockInvoke = vi.fn();
vi.mock('@tauri-apps/api/core', () => ({
  invoke: mockInvoke,
}));

describe('configService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have initialize method', async () => {
    mockInvoke.mockResolvedValueOnce(undefined);
    const { configService } = await import('../services/configService');
    
    expect(configService.initialize).toBeDefined();
    expect(typeof configService.initialize).toBe('function');
  });

  it('should have getApiKey method', async () => {
    const { configService } = await import('../services/configService');
    expect(configService.getApiKey).toBeDefined();
    expect(typeof configService.getApiKey).toBe('function');
  });

  it('should have setApiKey method', async () => {
    const { configService } = await import('../services/configService');
    expect(configService.setApiKey).toBeDefined();
    expect(typeof configService.setApiKey).toBe('function');
  });

  it('should have getConfig method', async () => {
    const { configService } = await import('../services/configService');
    expect(configService.getConfig).toBeDefined();
    expect(typeof configService.getConfig).toBe('function');
  });

  it('should have saveConfig method', async () => {
    const { configService } = await import('../services/configService');
    expect(configService.saveConfig).toBeDefined();
    expect(typeof configService.saveConfig).toBe('function');
  });
});
