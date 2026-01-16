import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { WatchlistItem } from '../types';
import { WatchlistStorage } from '../utils/watchlistStorage';
import { ConfirmDialog } from './ConfirmDialog';
import tmdbService from '../services/tmdbService';
import './DashboardComponent.css';

interface DashboardComponentProps {
  items: WatchlistItem[];
  onUpdate: (item: WatchlistItem) => void;
  onRemove: (id: string) => void;
}

interface EpisodeAirInfo {
  itemId: string;
  season: number;
  episode: number;
  airDate: string | null;
  title: string;
  posterPath: string | null;
}

export function DashboardComponent({ items, onUpdate, onRemove }: DashboardComponentProps) {
  const [airingNextEpisodes, setAiringNextEpisodes] = useState<EpisodeAirInfo[]>([]);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  // Get items that are being watched and have season/episode data
  const watchingItems = items.filter(
    item => item.status === 'watching' && item.seasons && item.seasons.length > 0
  );

  // Get items waiting for next episode
  const waitingItems = items.filter(
    item => item.status === 'waiting-for-next-ep' && item.seasons && item.seasons.length > 0
  );

  // Fetch episode air dates for waiting items
  useEffect(() => {
    const fetchAirDates = async () => {
      const episodes: EpisodeAirInfo[] = [];
      
      for (const item of waitingItems) {
        const currentSeason = item.currentSeason || 1;
        const currentEpisode = item.currentEpisode || 0;
        const seasonData = (item.seasons || []).find(s => s.season === currentSeason);
        
        if (!seasonData) continue;

        let nextSeason = currentSeason;
        let nextEpisode = currentEpisode + 1;

        // If we're at the last episode, move to next season
        if (nextEpisode > seasonData.episodes) {
          nextSeason = currentSeason + 1;
          nextEpisode = 1;
        }

        // Only fetch if next season exists
        if ((item.seasons || []).find(s => s.season === nextSeason)) {
          const details = await tmdbService.getEpisodeDetails(item.tmdbId, nextSeason, nextEpisode);
          if (details?.air_date) {
            const airDate = new Date(details.air_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // If air date has passed, move back to watching
            if (airDate < today) {
              const updated = { ...item, status: 'watching' as const };
              await WatchlistStorage.save(updated);
              onUpdate(updated);
            } else {
              episodes.push({
                itemId: item.id,
                season: nextSeason,
                episode: nextEpisode,
                airDate: details.air_date,
                title: item.title,
                posterPath: item.posterPath,
              });
            }
          }
        }
      }
      
      // Sort by air date
      episodes.sort((a, b) => new Date(a.airDate || '').getTime() - new Date(b.airDate || '').getTime());
      setAiringNextEpisodes(episodes);
    };

    if (waitingItems.length > 0) {
      fetchAirDates();
    }
  }, [items]);

  const handleMarkWatched = async (item: WatchlistItem) => {
    const currentSeason = item.currentSeason || 1;
    const currentEpisode = item.currentEpisode || 0;
    const seasonData = (item.seasons || []).find(s => s.season === currentSeason);

    if (!seasonData) {
      return;
    }

    if (currentEpisode < seasonData.episodes) {
      // Increment to next episode (the one user just watched)
      const nextEpisode = currentEpisode + 1;
      
      // Check if the episode AFTER this one (that user will watch next) has aired
      let newStatus = item.status;
      
      // We need to check the episode after the one they just watched
      const episodeToCheck = nextEpisode + 1;
      
      if (episodeToCheck <= seasonData.episodes) {
        // There's another episode after this one, check if it has aired
        const episodeDetails = await tmdbService.getEpisodeDetails(item.tmdbId, currentSeason, episodeToCheck);
        const nextEpisodeAirDate = episodeDetails?.air_date;
        
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // If air date is in the future OR not available yet, wait for it
        if (!nextEpisodeAirDate || nextEpisodeAirDate > todayString) {
          newStatus = 'waiting-for-next-ep';
        }
      } else {
        // No more episodes in this season after the one they just watched, check next season
        const nextSeason = currentSeason + 1;
        if ((item.seasons || []).find(s => s.season === nextSeason)) {
          const episodeDetails = await tmdbService.getEpisodeDetails(item.tmdbId, nextSeason, 1);
          const nextEpisodeAirDate = episodeDetails?.air_date;
          
          const today = new Date();
          const todayString = today.toISOString().split('T')[0];
          
          // If air date is in the future OR not available yet, wait for it
          if (!nextEpisodeAirDate || nextEpisodeAirDate > todayString) {
            newStatus = 'waiting-for-next-ep';
          }
        }
      }
      
      const updated = { 
        ...item, 
        currentEpisode: nextEpisode,
        status: newStatus
      };
      
      await WatchlistStorage.save(updated);
      onUpdate(updated);
    } else {
      // Move to next season
      const nextSeason = currentSeason + 1;
      const nextSeasonData = (item.seasons || []).find(s => s.season === nextSeason);
      if (nextSeasonData) {
        // User has finished season, moving to season+1 episode 1
        // Check if episode 1 of next season has aired
        let newStatus = item.status;
        
        const episodeDetails = await tmdbService.getEpisodeDetails(item.tmdbId, nextSeason, 1);
        const firstEpisodeAirDate = episodeDetails?.air_date;
        
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // If air date is in the future OR not available yet, wait for it
        if (!firstEpisodeAirDate || firstEpisodeAirDate > todayString) {
          newStatus = 'waiting-for-next-ep';
        }
        
        const updated = { 
          ...item, 
          currentSeason: nextSeason, 
          currentEpisode: 1,
          status: newStatus
        };
        
        await WatchlistStorage.save(updated);
        onUpdate(updated);
      } else {
        // No more seasons - mark as completed
        const updated = { ...item, status: 'completed' as const };
        await WatchlistStorage.save(updated);
        onUpdate(updated);
      }
    }
  };

  const getNextEpisodeInfo = (item: WatchlistItem) => {
    const currentSeason = item.currentSeason || 1;
    const currentEpisode = item.currentEpisode || 0;
    const seasonData = (item.seasons || []).find(s => s.season === currentSeason);

    if (!seasonData) return null;

    if (currentEpisode < seasonData.episodes) {
      return {
        season: currentSeason,
        episode: currentEpisode + 1,
        isLastEpisode: currentEpisode + 1 === seasonData.episodes,
      };
    } else {
      const nextSeason = currentSeason + 1;
      const nextSeasonData = (item.seasons || []).find(s => s.season === nextSeason);
      if (nextSeasonData) {
        return {
          season: nextSeason,
          episode: 1,
          isSeasonFinale: true,
        };
      }
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📺 Up Next</h2>
        <p className="subtitle">
          {watchingItems.length === 0
            ? 'No shows currently being watched'
            : `${watchingItems.length} show${watchingItems.length !== 1 ? 's' : ''} to continue`}
        </p>
      </div>

      {watchingItems.length === 0 ? (
        <div className="empty-dashboard">
          <div className="empty-icon">📺</div>
          <h3>Nothing to watch right now</h3>
          <p>Mark TV shows or anime as "Watching" to see them here</p>
        </div>
      ) : (
        <div className="upcoming-episodes">
          {watchingItems.map((item) => {
            const nextInfo = getNextEpisodeInfo(item);
            const currentSeason = item.currentSeason || 1;
            const currentEpisode = item.currentEpisode || 0;
            const seasonData = (item.seasons || []).find(s => s.season === currentSeason);
            
            // Check if we're at the last episode of the last season
            const isLastEpisodeOfLastSeason = seasonData && 
              currentEpisode === seasonData.episodes && 
              !(item.seasons || []).find(s => s.season === currentSeason + 1);

            if (!nextInfo && !isLastEpisodeOfLastSeason) return null;

            return (
              <div key={item.id} className="episode-card">
                <div 
                  className="card-poster"
                  onClick={() => setSelectedItem(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={tmdbService.getImageUrl(item.posterPath || '', 200)}
                    alt={item.title}
                    className="poster-image"
                  />
                </div>

                <div className="card-content">
                  <div className="card-title-section">
                    <h3 className="card-title">{item.title}</h3>
                    <span className="media-type-badge">
                      {item.mediaType === 'tv' ? '📺 TV Show' : '🎨 Anime'}
                    </span>
                  </div>

                  <div className="episode-info">
                    {!isLastEpisodeOfLastSeason && nextInfo && (
                      <div className="next-episode">
                        <span className="label">Next Episode to Watch:</span>
                        <span className="value next-badge">
                          {nextInfo.isSeasonFinale ? '⭐ Season ' : 'Season '}{nextInfo.season}{' '}
                          Episode {nextInfo.episode}
                          {nextInfo.isLastEpisode ? ' (Season Finale)' : ''}
                        </span>
                      </div>
                    )}

                    {isLastEpisodeOfLastSeason && (
                      <div className="next-episode">
                        <span className="label">Status:</span>
                        <span className="value next-badge">🎉 Series Complete</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkWatched(item)}
                    className="watch-button"
                  >
                    {isLastEpisodeOfLastSeason ? '✓ Mark as Completed' : '✓ Mark Watched'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {airingNextEpisodes.length > 0 && (
        <div className="airing-section">
          <div className="airing-header">
            <div className="airing-title-group">
              <h2 className="airing-title">🎬 Airing Next</h2>
              <p className="airing-subtitle">TV & Shows sorted by date</p>
            </div>
            <p className="airing-date">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="airing-grid">
            {airingNextEpisodes.map((ep) => {
              const airDate = ep.airDate ? new Date(ep.airDate) : new Date();
              const formattedDate = airDate.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '-');
              
              return (
                <div key={ep.itemId} className="airing-card">
                  <div 
                    className="airing-poster"
                    onClick={() => {
                      const item = items.find(i => i.id === ep.itemId);
                      if (item) setSelectedItem(item);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={tmdbService.getImageUrl(ep.posterPath || '', 200)}
                      alt={ep.title}
                    />
                    <div className="airing-overlay">
                      <h4 className="airing-card-title">{ep.title}</h4>
                    </div>
                  </div>
                  <div className="airing-date-info">
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedItem && (
        createPortal(
          <div className="detail-modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="detail-close-button" 
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            
            <div className="detail-poster">
              <img
                src={tmdbService.getImageUrl(selectedItem.posterPath || '', 300)}
                alt={selectedItem.title}
                className="detail-poster-image"
              />
            </div>

            <div className="detail-content">
              <h3 className="detail-title">{selectedItem.title}</h3>

              <div className="detail-status-selector">
                <label>Status:</label>
                <select
                  value={selectedItem.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as WatchlistItem['status'];
                    const updated = { ...selectedItem, status: newStatus };
                    WatchlistStorage.save(updated);
                    onUpdate(updated);
                    setSelectedItem(updated);
                  }}
                  className="status-select"
                >
                  <option value="plan-to-watch">📋 Plan to watch</option>
                  <option value="watching">👀 Watching</option>
                  <option value="waiting-for-next-ep">⏳ Waiting for next episode</option>
                  <option value="on-hold">⏸️ On Hold</option>
                  <option value="dropped">🚫 Dropped</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {selectedItem.seasons && selectedItem.seasons.length > 0 && (
                <div className="detail-episode-tracker">
                  <label>Episode Progress:</label>
                  <div className="episode-controls">
                    <select
                      value={selectedItem.currentSeason || 1}
                      onChange={(e) => {
                        const updated = { ...selectedItem, currentSeason: parseInt(e.target.value) };
                        WatchlistStorage.save(updated);
                        onUpdate(updated);
                        setSelectedItem(updated);
                      }}
                      className="season-select"
                    >
                      {selectedItem.seasons.map((season) => (
                        <option key={season.season} value={season.season}>
                          Season {season.season}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedItem.currentEpisode || 0}
                      onChange={(e) => {
                        const updated = { ...selectedItem, currentEpisode: parseInt(e.target.value) || 0 };
                        WatchlistStorage.save(updated);
                        onUpdate(updated);
                        setSelectedItem(updated);
                      }}
                      className="episode-select"
                    >
                      <option value={0}>Select Episode</option>
                      {Array.from({ length: ((selectedItem.seasons || []).find(s => s.season === (selectedItem.currentSeason || 1))?.episodes) || 0 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Episode {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                className="detail-remove-button"
                onClick={() => {
                  setSelectedItem(null);
                  setItemToRemove(selectedItem.id);
                }}
              >
                🗑️ Remove from Watchlist
              </button>
            </div>
          </div>
        </div>,
        document.body
        )
      )}

      {itemToRemove && createPortal(
        <ConfirmDialog
          title="Remove from Watchlist"
          message="Are you sure you want to remove this item? This action cannot be undone."
          confirmLabel="Remove"
          cancelLabel="Keep It"
          isDangerous={true}
          onConfirm={async () => {
            await WatchlistStorage.remove(itemToRemove);
            onRemove(itemToRemove);
            setItemToRemove(null);
          }}
          onCancel={() => setItemToRemove(null)}
        />,
        document.body
      )}
    </div>
  );
}
