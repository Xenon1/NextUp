import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { TMDBMovie, TMDBTVShow } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

interface SearchResponse {
  results: TMDBMovie[] | TMDBTVShow[];
  total_results: number;
  total_pages: number;
}

class TMDBService {
  private api: AxiosInstance;
  private apiKey: string = '';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.api = axios.create({
      baseURL: BASE_URL,
      params: {
        api_key: this.apiKey,
      },
    });
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.api = axios.create({
      baseURL: BASE_URL,
      params: {
        api_key: this.apiKey,
      },
    });
  }

  // Search for movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await this.api.get('/search/movie', {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  // Search for TV shows
  async searchTVShows(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await this.api.get('/search/tv', {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  }

  // Get movie details
  async getMovieDetails(movieId: number) {
    try {
      const response = await this.api.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  // Get TV show details
  async getTVShowDetails(tvId: number) {
    try {
      const response = await this.api.get(`/tv/${tvId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }

  // Get TV show with complete season and episode information
  async getTVShowWithSeasons(tvId: number) {
    try {
      const response = await this.api.get(`/tv/${tvId}`);
      const tvData = response.data;
      
      // Extract season information from the response
      interface SeasonData {
        season_number: number;
        episode_count: number;
      }
      const seasons = tvData.seasons?.map((season: SeasonData) => ({
        season: season.season_number,
        episodes: season.episode_count,
      })) || [];
      
      return {
        seasons,
        numberOfSeasons: tvData.number_of_seasons || 0,
        numberOfEpisodes: tvData.number_of_episodes || 0,
      };
    } catch (error) {
      console.error('Error fetching TV show with seasons:', error);
      // Return empty data on error, don't throw to allow graceful degradation
      return {
        seasons: [],
        numberOfSeasons: 0,
        numberOfEpisodes: 0,
      };
    }
  }

  // Get episode details with air date
  async getEpisodeDetails(tvId: number, seasonNumber: number, episodeNumber: number) {
    try {
      const response = await this.api.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching episode details:', error);
      return null;
    }
  }

  // Get trending movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<SearchResponse> {
    try {
      const response = await this.api.get(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  }

  // Get trending TV shows
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<SearchResponse> {
    try {
      const response = await this.api.get(`/trending/tv/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  }

  // Get image URL
  getImageUrl(path: string, width: number = 500): string {
    if (!path) return 'https://via.placeholder.com/' + width + 'x750?text=No+Image';
    return `https://image.tmdb.org/t/p/w${width}${path}`;
  }
}

export default new TMDBService();
