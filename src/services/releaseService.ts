import axios from 'axios';

interface Release {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
}

class ReleaseService {
  private static readonly REPO = 'Xenon1/NextUp';
  private static readonly GITHUB_API = 'https://api.github.com/repos';
  private static readonly CACHE_KEY = 'nextup_release_check';

  /**
   * Parse version string to comparable format
   * e.g., "0.1.0" -> [0, 1, 0]
   */
  private static parseVersion(version: string): number[] {
    return version.replace(/^v/, '').split('.').map(Number);
  }

  /**
   * Compare two versions
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  private static compareVersions(v1: string, v2: string): number {
    const v1Parts = this.parseVersion(v1);
    const v2Parts = this.parseVersion(v2);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }

    return 0;
  }

  /**
   * Get the latest release from GitHub
   */
  static async getLatestRelease(): Promise<Release | null> {
    try {
      const response = await axios.get<Release>(
        `${this.GITHUB_API}/${this.REPO}/releases/latest`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return null;
    }
  }

  /**
   * Check if a new version is available
   */
  static async checkForUpdate(currentVersion: string): Promise<Release | null> {
    // Fetch latest release (no cache on first check for reliability)
    const release = await this.getLatestRelease();
    if (!release) {
      // If fetch fails, check cache as fallback
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const { release: cachedRelease } = JSON.parse(cached);
        const latestVersion = cachedRelease.tag_name.replace(/^v/, '');
        if (this.compareVersions(currentVersion, latestVersion) < 0) {
          return cachedRelease;
        }
      }
      return null;
    }

    // Update cache for next time
    localStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify({
        release,
        timestamp: Date.now(),
      })
    );

    // Compare versions
    const latestVersion = release.tag_name.replace(/^v/, '');
    if (this.compareVersions(currentVersion, latestVersion) < 0) {
      return release;
    }

    return null;
  }

  /**
   * Clear the release check cache
   */
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Get changelog URL for a release
   */
  static getChangelogUrl(release: Release): string {
    return `https://github.com/${this.REPO}/releases/tag/${release.tag_name}`;
  }
}

export default ReleaseService;
export type { Release };
