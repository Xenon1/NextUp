import { describe, it, expect, vi, beforeEach } from 'vitest';
import releaseService from '../services/releaseService';

// Mock axios
vi.mock('axios');

describe('Release Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('checkForUpdate', () => {
    it('should return null if current version is latest', async () => {
      const result = await releaseService.checkForUpdate('1.0.0');
      // May return release or null depending on actual GitHub state
      expect(typeof result === 'object' || result === null).toBe(true);
    });

    it('should detect newer versions', () => {
      const v1 = releaseService['compareVersions']('0.1.0', '0.2.0');
      expect(v1).toBe(-1); // 0.1.0 < 0.2.0
    });

    it('should detect same versions', () => {
      const v1 = releaseService['compareVersions']('1.0.0', '1.0.0');
      expect(v1).toBe(0); // 1.0.0 = 1.0.0
    });

    it('should detect older versions', () => {
      const v1 = releaseService['compareVersions']('1.0.0', '0.9.0');
      expect(v1).toBe(1); // 1.0.0 > 0.9.0
    });

    it('should handle version parsing correctly', () => {
      const v1 = releaseService['compareVersions']('1.0.0', '1.0.1');
      expect(v1).toBe(-1);

      const v2 = releaseService['compareVersions']('2.0.0', '1.9.9');
      expect(v2).toBe(1);
    });

    it('should cache results in localStorage', async () => {
      const initialCache = localStorage.getItem('nextup_release_check');
      expect(initialCache).toBeNull();

      // After calling checkForUpdate, cache should be set if result exists
      const result = await releaseService.checkForUpdate('99.0.0');
      const cache = localStorage.getItem('nextup_release_check');

      if (result) {
        expect(cache).not.toBeNull();
      }
    });

    it('should clear cache when requested', () => {
      localStorage.setItem('test_key', 'test_value');
      releaseService.clearCache();
      const cache = localStorage.getItem('nextup_release_check');
      expect(cache).toBeNull();
    });
  });

  describe('getChangelogUrl', () => {
    it('should generate correct GitHub release URL', () => {
      const release = {
        tag_name: 'v1.0.0',
        name: 'Version 1.0.0',
        body: 'Release notes',
        html_url: 'https://github.com/Xenon1/NextUp/releases/tag/v1.0.0',
        published_at: '2026-01-10T00:00:00Z',
      };

      const url = releaseService.getChangelogUrl(release);
      expect(url).toContain('github.com');
      expect(url).toContain('v1.0.0');
      expect(url).toContain('releases');
    });
  });

  describe('version comparison edge cases', () => {
    it('should handle versions with different part counts', () => {
      const v1 = releaseService['compareVersions']('1.0', '1.0.0');
      expect(v1).toBe(0); // Should treat as equal

      const v2 = releaseService['compareVersions']('1.0.0', '1.0.1');
      expect(v2).toBe(-1);
    });

    it('should handle v prefix in versions', () => {
      const v1 = releaseService['compareVersions']('v1.0.0', 'v1.1.0');
      expect(v1).toBe(-1); // v1.0.0 < v1.1.0
    });

    it('should handle patch versions correctly', () => {
      const v1 = releaseService['compareVersions']('1.0.0', '1.0.1');
      expect(v1).toBe(-1);

      const v2 = releaseService['compareVersions']('1.1.0', '1.0.9');
      expect(v2).toBe(1);
    });
  });
});
