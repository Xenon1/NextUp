import { describe, it, expect } from 'vitest';

// Status management utilities
export function canTransitionStatus(_currentStatus: string, newStatus: string, mediaType: string): boolean {
  // Movies can't transition to waiting-for-next-ep
  if (mediaType === 'movie' && newStatus === 'waiting-for-next-ep') {
    return false;
  }
  
  // Any status can transition to any other status (except the restriction above)
  const validStatuses = ['plan-to-watch', 'watching', 'waiting-for-next-ep', 'on-hold', 'dropped', 'completed'];
  return validStatuses.includes(newStatus);
}

export function getNextAutoStatus(
  currentStatus: string,
  airingDate: string | null,
  mediaType: string
): string {
  if (mediaType === 'movie') return currentStatus; // Movies don't auto-transition
  
  if (currentStatus === 'watching' && airingDate) {
    const now = new Date();
    const airing = new Date(airingDate);
    
    // If airing date hasn't passed, should be waiting-for-next-ep
    if (airing > now) {
      return 'waiting-for-next-ep';
    }
    // If airing date passed, back to watching
    return 'watching';
  }
  
  return currentStatus;
}

describe('Status Management Utils', () => {
  describe('canTransitionStatus', () => {
    it('should allow movie to transition to watching', () => {
      expect(canTransitionStatus('plan-to-watch', 'watching', 'movie')).toBe(true);
    });

    it('should prevent movie from transitioning to waiting-for-next-ep', () => {
      expect(canTransitionStatus('watching', 'waiting-for-next-ep', 'movie')).toBe(false);
    });

    it('should allow TV show to transition to waiting-for-next-ep', () => {
      expect(canTransitionStatus('watching', 'waiting-for-next-ep', 'tv')).toBe(true);
    });

    it('should allow anime to transition to waiting-for-next-ep', () => {
      expect(canTransitionStatus('watching', 'waiting-for-next-ep', 'anime')).toBe(true);
    });

    it('should allow transitions to completed', () => {
      expect(canTransitionStatus('watching', 'completed', 'tv')).toBe(true);
    });

    it('should allow transitions to dropped', () => {
      expect(canTransitionStatus('watching', 'dropped', 'movie')).toBe(true);
    });

    it('should allow transitions to on-hold', () => {
      expect(canTransitionStatus('watching', 'on-hold', 'anime')).toBe(true);
    });
  });

  describe('getNextAutoStatus', () => {
    it('should return current status for movies', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      expect(getNextAutoStatus('watching', futureDate, 'movie')).toBe('watching');
    });

    it('should transition to waiting-for-next-ep when episode airs in future', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      expect(getNextAutoStatus('watching', futureDate, 'tv')).toBe('waiting-for-next-ep');
    });

    it('should stay watching when airing date passed', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      expect(getNextAutoStatus('watching', pastDate, 'tv')).toBe('watching');
    });

    it('should handle null airing date', () => {
      expect(getNextAutoStatus('watching', null, 'tv')).toBe('watching');
    });

    it('should work for anime with future airing date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      expect(getNextAutoStatus('watching', futureDate, 'anime')).toBe('waiting-for-next-ep');
    });
  });
});
