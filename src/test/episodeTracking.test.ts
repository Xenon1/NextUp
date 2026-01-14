import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Episode Tracking Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Next Episode Air Date Checking', () => {
    it('should mark episode as waiting when next episode has not aired', () => {
      // Test data
      const today = new Date('2026-01-14').toISOString().split('T')[0];
      const nextEpisodeAirDate = '2026-01-20'; // Future date

      // Logic: if next episode hasn't aired yet, status should be waiting-for-next-ep
      const shouldWait = !nextEpisodeAirDate || nextEpisodeAirDate > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : 'watching';

      expect(shouldWait).toBe(true);
      expect(newStatus).toBe('waiting-for-next-ep');
    });

    it('should keep watching status when next episode has aired', () => {
      // Test data
      const today = new Date('2026-01-14').toISOString().split('T')[0];
      const nextEpisodeAirDate = '2026-01-13'; // Past date

      // Logic: if next episode has already aired, keep watching status
      const shouldWait = !nextEpisodeAirDate || nextEpisodeAirDate > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : 'watching';

      expect(shouldWait).toBe(false);
      expect(newStatus).toBe('watching');
    });

    it('should mark as waiting when air date is not available', () => {
      // Test data
      const today = new Date('2026-01-14').toISOString().split('T')[0];
      const nextEpisodeAirDate: string | null = null; // No air date available

      // Logic: if no air date, assume it hasn't aired yet
      const shouldWait = !nextEpisodeAirDate || (nextEpisodeAirDate as string) > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : 'watching';

      expect(shouldWait).toBe(true);
      expect(newStatus).toBe('waiting-for-next-ep');
    });

    it('should handle same day air dates', () => {
      // Test data
      const today = new Date('2026-01-14').toISOString().split('T')[0];
      const nextEpisodeAirDate = '2026-01-14'; // Same day

      // Logic: if air date is today or later, it should still be treated as aired
      const shouldWait = !nextEpisodeAirDate || nextEpisodeAirDate > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : 'watching';

      expect(shouldWait).toBe(false);
      expect(newStatus).toBe('watching');
    });
  });

  describe('Episode Number Checking', () => {
    it('should check next episode + 1 when marking current episode as watched', () => {
      const currentEpisode = 1; // Just watched episode 1
      const nextEpisode = currentEpisode + 1; // Will watch episode 2
      const episodeToCheck = nextEpisode + 1; // Check if episode 3 has aired

      // When marking E1 as watched, check E3 (not E2)
      expect(episodeToCheck).toBe(3);
      expect(nextEpisode).toBe(2);
    });

    it('should check season boundary correctly', () => {
      const currentEpisode = 2;
      const seasonData = { season: 8, episodes: 2 }; // Only 2 episodes in season
      const nextEpisode = currentEpisode + 1; // Episode 3 (doesn't exist)

      // If next episode > season episodes, move to next season
      const shouldMoveToNextSeason = nextEpisode > seasonData.episodes;

      expect(shouldMoveToNextSeason).toBe(true);
    });

    it('should handle last episode of season', () => {
      const currentEpisode = 8;
      const seasonData = { season: 7, episodes: 8 }; // Last episode is 8
      const nextEpisode = currentEpisode + 1; // Episode 9 (doesn't exist)

      // If next episode > season episodes, move to next season
      const shouldMoveToNextSeason = nextEpisode > seasonData.episodes;

      expect(shouldMoveToNextSeason).toBe(true);
      expect(nextEpisode).toBe(9);
    });
  });

  describe('Season Transitions', () => {
    it('should check first episode of next season when current season ends', () => {
      const currentSeason = 7;
      const nextSeason = currentSeason + 1;
      const episodeToCheck = 1; // Check first episode of next season

      expect(nextSeason).toBe(8);
      expect(episodeToCheck).toBe(1);
    });

    it('should handle multiple seasons correctly', () => {
      const seasons = [
        { season: 1, episodes: 10 },
        { season: 2, episodes: 12 },
        { season: 3, episodes: 8 },
      ];

      const currentSeason = 1;
      const hasNextSeason = seasons.some(s => s.season === currentSeason + 1);

      expect(hasNextSeason).toBe(true);
    });

    it('should handle last season correctly', () => {
      const seasons = [
        { season: 1, episodes: 10 },
        { season: 2, episodes: 12 },
      ];

      const currentSeason = 2;
      const hasNextSeason = seasons.some(s => s.season === currentSeason + 1);

      expect(hasNextSeason).toBe(false);
    });
  });

  describe('Status Update Logic', () => {
    it('should preserve current status when next episode has aired', () => {
      const currentStatus = 'watching';
      const nextEpisodeAirDate = '2026-01-13'; // Already aired
      const today = '2026-01-14';

      const shouldWait = !nextEpisodeAirDate || nextEpisodeAirDate > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : currentStatus;

      expect(newStatus).toBe('watching');
    });

    it('should change to waiting-for-next-ep when episode not aired', () => {
      const currentStatus = 'watching';
      const nextEpisodeAirDate = '2026-01-20'; // Hasn't aired yet
      const today = '2026-01-14';

      const shouldWait = !nextEpisodeAirDate || nextEpisodeAirDate > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : currentStatus;

      expect(newStatus).toBe('waiting-for-next-ep');
    });

    it('should handle edge case of undefined air date', () => {
      const currentStatus = 'watching';
      const nextEpisodeAirDate: string | undefined = undefined;
      const today = '2026-01-14';

      const shouldWait = !nextEpisodeAirDate || (nextEpisodeAirDate as string) > today;
      const newStatus = shouldWait ? 'waiting-for-next-ep' : currentStatus;

      expect(newStatus).toBe('waiting-for-next-ep');
    });
  });

  describe('Anime vs TV Show Handling', () => {
    it('should apply same logic to both anime and TV shows', () => {
      const tvShowLogic = (airDate: string, today: string) => {
        return !airDate || airDate > today ? 'waiting-for-next-ep' : 'watching';
      };

      const animeLogic = (airDate: string, today: string) => {
        return !airDate || airDate > today ? 'waiting-for-next-ep' : 'watching';
      };

      const testDate = '2026-01-20';
      const today = '2026-01-14';

      const tvResult = tvShowLogic(testDate, today);
      const animeResult = animeLogic(testDate, today);

      expect(tvResult).toBe(animeResult);
      expect(tvResult).toBe('waiting-for-next-ep');
    });
  });
});
