// Media types
export type MediaType = 'movie' | 'tv' | 'anime';

// Season episode data
export interface SeasonData {
  season: number;
  episodes: number;
}

// Watchlist item
export interface WatchlistItem {
  id: string; // unique id combining type and tmdb id
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  overview: string;
  releaseDate: string;
  rating: number;
  status: 'plan-to-watch' | 'watching' | 'waiting-for-next-ep' | 'on-hold' | 'dropped' | 'completed';
  addedDate: number; // timestamp
  notes?: string;
  // Season/Episode tracking for TV and Anime
  seasons?: SeasonData[]; // Array of seasons with episode counts
  currentSeason?: number;
  currentEpisode?: number;
}

// TMDB Movie
export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

// TMDB TV Show
export interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
}

// Search filters
export interface SearchFilters {
  mediaType: MediaType;
  searchQuery: string;
}

// Stats for dashboard
export interface WatchlistStats {
  totalItems: number;
  unwatched: number;
  watching: number;
  watched: number;
  averageRating: number;
}
