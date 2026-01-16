import { useState, useCallback, useEffect } from 'react';
import type { TMDBMovie, TMDBTVShow, MediaType, WatchlistItem } from '../types';
import tmdbService from '../services/tmdbService';
import { WatchlistStorage } from '../utils/watchlistStorage';
import { useNotification } from '../hooks/useNotification';
import './SearchComponent.css';

interface SearchComponentProps {
  onAddToWatchlist: (item: WatchlistItem) => void;
}

export function SearchComponent({ onAddToWatchlist }: SearchComponentProps) {
  const { notify } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItemForStatus, setSelectedItemForStatus] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'plan-to-watch' | 'watching' | 'waiting-for-next-ep' | 'on-hold' | 'dropped' | 'completed'>('plan-to-watch');
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [selectedSearchItem, setSelectedSearchItem] = useState<TMDBMovie | TMDBTVShow | null>(null);

  // Load watchlist IDs on mount
  useEffect(() => {
    const loadWatchlistIds = async () => {
      const items = await WatchlistStorage.getAll();
      const ids = new Set(items.map(item => `${item.mediaType}-${item.tmdbId}`));
      setWatchlistIds(ids);
    };
    loadWatchlistIds();
  }, []);

  // Debounced real-time search
  const handleSearch = useCallback(async (searchPage: number = 1) => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (mediaType === 'movie') {
        response = await tmdbService.searchMovies(searchQuery, searchPage);
      } else if (mediaType === 'tv') {
        response = await tmdbService.searchTVShows(searchQuery, searchPage);
      } else {
        // For anime, search TV shows and filter
        response = await tmdbService.searchTVShows(searchQuery, searchPage);
      }

      setResults(response.results);
      setTotalPages(response.total_pages);
      setPage(searchPage);
    } catch {
      setError('Failed to search. Make sure your TMDB API key is valid.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, mediaType]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError('');
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(1);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery, mediaType, handleSearch]);

  const handleAddToWatchlist = async (item: TMDBMovie | TMDBTVShow, status: 'plan-to-watch' | 'watching' | 'waiting-for-next-ep' | 'on-hold' | 'dropped' | 'completed') => {
    const isTVShow = 'name' in item;
    const watchlistItem: WatchlistItem = {
      id: `${mediaType}-${item.id}`,
      tmdbId: item.id,
      mediaType: mediaType,
      title: isTVShow ? item.name : item.title,
      posterPath: item.poster_path,
      overview: item.overview,
      releaseDate: isTVShow ? item.first_air_date : item.release_date,
      rating: item.vote_average,
      status: status,
      addedDate: Date.now(),
    };

    // Fetch season/episode data for TV shows and anime
    if ((mediaType === 'tv' || mediaType === 'anime') && isTVShow) {
      try {
        const seasonData = await tmdbService.getTVShowWithSeasons(item.id);
        watchlistItem.seasons = seasonData.seasons;
        if (seasonData.seasons.length > 0) {
          watchlistItem.currentSeason = 1;
          watchlistItem.currentEpisode = 0;
        }
      } catch (err) {
        console.error('Failed to fetch season data:', err);
        // Continue anyway, seasons can be added manually
      }
    }

    WatchlistStorage.save(watchlistItem);

    // Update local watchlist IDs
    setWatchlistIds(prev => new Set([...prev, `${mediaType}-${item.id}`]));

    onAddToWatchlist(watchlistItem);
    setSelectedItemForStatus(null);

    // Show feedback
    notify(`"${watchlistItem.title}" added to your watchlist as ${status.replaceAll('-', ' ')}!`, 'success');
  };

  const isItemInWatchlist = (id: number): boolean => {
    return watchlistIds.has(`${mediaType}-${id}`);
  };

  return (
    <>
      <div className="search-container">
        <div className="search-header">
          <h2>Add to Watchlist</h2>
          <p>Search for movies, TV shows, or anime to add to your list</p>
        </div>

        <div className="search-filters">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, or anime..."
              className="search-input"
            />
            {loading && <div className="search-loading">🔄</div>}
          </div>

          <div className="media-type-selector">
            <label>Type:</label>
            <div className="type-buttons">
              {(['movie', 'tv', 'anime'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setMediaType(type);
                    setResults([]);
                    setPage(1);
                  }}
                  className={`type-button ${mediaType === type ? 'active' : ''}`}
                >
                  {type === 'movie' ? '🎬 Movies' : type === 'tv' ? '📺 TV Shows' : '🎨 Anime'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="search-results">
          {results.length > 0 ? (
            <>
              <div className="results-grid">
                {results.map((item) => {
                  const isTVShow = 'name' in item;
                  const title = isTVShow ? item.name : item.title;
                  const releaseDate = isTVShow ? item.first_air_date : item.release_date;
                  const inWatchlist = isItemInWatchlist(item.id);

                  return (
                    <div key={item.id} className="result-card">
                      <div
                        className="poster-container"
                        onClick={() => setSelectedSearchItem(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={tmdbService.getImageUrl(item.poster_path || '')}
                          alt={title}
                          className="poster-image"
                        />
                        {inWatchlist && <div className="in-watchlist-badge">✓ In Watchlist</div>}
                      </div>
                      <div className="result-info">
                        <h3 className="result-title">{title}</h3>
                        {releaseDate && (
                          <p className="result-date">{new Date(releaseDate).getFullYear()}</p>
                        )}
                        <div className="result-rating">
                          <span className="rating-value">⭐ {item.vote_average.toFixed(1)}</span>
                        </div>
                        <p className="result-overview">{item.overview.substring(0, 100)}...</p>
                        <button
                          onClick={() => {
                            setSelectedItemForStatus(item);
                            setSelectedStatus('plan-to-watch');
                          }}
                          disabled={inWatchlist || loading}
                          className={`add-button ${inWatchlist ? 'added' : ''}`}
                        >
                          {inWatchlist ? 'Added ✓' : '+ Add to Watchlist'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handleSearch(page - 1)}
                    disabled={page === 1 || loading}
                    className="pagination-button"
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handleSearch(page + 1)}
                    disabled={page === totalPages || loading}
                    className="pagination-button"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && results.length === 0 && searchQuery && (
              <div className="no-results">
                <p>No results found. Try a different search query.</p>
              </div>
            )
          )}
        </div>
      </div>

      {selectedItemForStatus && (
        <div className="modal-overlay" onClick={() => setSelectedItemForStatus(null)}>
          <div className="status-selector-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Status</h3>
            <p>Choose a status for: <strong>{('name' in selectedItemForStatus ? selectedItemForStatus.name : selectedItemForStatus.title)}</strong></p>
            <div className="status-options">
              <button
                className={`status-option ${selectedStatus === 'plan-to-watch' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('plan-to-watch')}
              >
                📋 Plan to watch
              </button>
              <button
                className={`status-option ${selectedStatus === 'watching' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('watching')}
              >
                👀 Watching
              </button>
              <button
                className={`status-option ${selectedStatus === 'waiting-for-next-ep' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('waiting-for-next-ep')}
              >
                ⏳ Waiting for next episode
              </button>
              <button
                className={`status-option ${selectedStatus === 'on-hold' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('on-hold')}
              >
                ⏸️ On Hold
              </button>
              <button
                className={`status-option ${selectedStatus === 'dropped' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('dropped')}
              >
                🚫 Dropped
              </button>
              <button
                className={`status-option ${selectedStatus === 'completed' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('completed')}
              >
                ✅ Completed
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="confirm-button"
                onClick={() => {
                  handleAddToWatchlist(selectedItemForStatus, selectedStatus);
                }}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add to Watchlist'}
              </button>
              <button
                className="cancel-button"
                onClick={() => setSelectedItemForStatus(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSearchItem && (
        <div className="detail-modal-overlay" onClick={() => setSelectedSearchItem(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="detail-close-button"
              onClick={() => setSelectedSearchItem(null)}
            >
              ✕
            </button>

            <div className="detail-poster">
              <img
                src={tmdbService.getImageUrl(selectedSearchItem.poster_path || '', 300)}
                alt={'name' in selectedSearchItem ? selectedSearchItem.name : selectedSearchItem.title}
                className="detail-poster-image"
              />
            </div>

            <div className="detail-content">
              <h3 className="detail-title">{'name' in selectedSearchItem ? selectedSearchItem.name : selectedSearchItem.title}</h3>

              <div className="detail-status-selector">
                <label>Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as WatchlistItem['status'])}
                  className="status-select"
                >
                  <option value="plan-to-watch">📋 Plan to watch</option>
                  <option value="watching">👀 Watching</option>
                  {(mediaType === 'tv' || mediaType === 'anime') && (
                    <option value="waiting-for-next-ep">⏳ Waiting for next episode</option>
                  )}
                  <option value="on-hold">⏸️ On Hold</option>
                  <option value="dropped">🚫 Dropped</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              <button
                className="confirm-button"
                onClick={() => {
                  handleAddToWatchlist(selectedSearchItem, selectedStatus);
                  setSelectedSearchItem(null);
                }}
                disabled={loading || isItemInWatchlist(selectedSearchItem.id)}
              >
                {isItemInWatchlist(selectedSearchItem.id) ? 'Already in Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
