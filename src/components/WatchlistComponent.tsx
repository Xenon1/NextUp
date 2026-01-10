import { useState } from 'react';
import type { WatchlistItem } from '../types';
import { WatchlistStorage } from '../utils/watchlistStorage';
import tmdbService from '../services/tmdbService';
import './WatchlistComponent.css';

interface WatchlistComponentProps {
  items: WatchlistItem[];
  mediaType: 'movie' | 'tv' | 'anime';
  onUpdate: (item: WatchlistItem) => void;
  onRemove: (id: string) => void;
}

interface DetailPanelProps {
  item: WatchlistItem;
  mediaType: 'movie' | 'tv' | 'anime';
  onClose: () => void;
  onStatusChange: (item: WatchlistItem, newStatus: WatchlistItem['status']) => Promise<void>;
  onNotesChange: (item: WatchlistItem, notes: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onCurrentSeasonChange: (item: WatchlistItem, season: number) => Promise<void>;
  onCurrentEpisodeChange: (item: WatchlistItem, episode: number) => Promise<void>;
  onIncrementEpisode: (item: WatchlistItem) => Promise<void>;
}

// Move DetailPanel outside of component
const DetailPanel = ({
  item,
  mediaType,
  onClose,
  onStatusChange,
  onNotesChange,
  onRemove,
  onCurrentSeasonChange,
  onCurrentEpisodeChange,
  onIncrementEpisode,
}: DetailPanelProps) => (
  <div className="detail-modal-overlay" onClick={onClose}>
    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
      <button 
        className="detail-close-button" 
        onClick={onClose}
      >
        ✕
      </button>
      
      <div className="detail-poster">
        <img
          src={tmdbService.getImageUrl(item.posterPath || '', 300)}
          alt={item.title}
          className="detail-poster-image"
        />
      </div>

      <div className="detail-content">
        <h3 className="detail-title">{item.title}</h3>

        <div className="detail-status-selector">
          <label>Status:</label>
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item, e.target.value as WatchlistItem['status'])}
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

        {(mediaType === 'tv' || mediaType === 'anime') && item.seasons && item.seasons.length > 0 && (
          <div className="detail-episode-tracker">
            <div className="tracker-controls">
              <div className="control-group">
                <label>Season:</label>
                <select
                  value={item.currentSeason || 1}
                  onChange={(e) => onCurrentSeasonChange(item, parseInt(e.target.value))}
                  className="season-select"
                >
                  {item.seasons.map((season) => (
                    <option key={season.season} value={season.season}>
                      Season {season.season}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Episode:</label>
                <select
                  value={item.currentEpisode || 0}
                  onChange={(e) => onCurrentEpisodeChange(item, parseInt(e.target.value))}
                  className="episode-select"
                >
                  <option value={0}>Select Episode</option>
                  {Array.from({ length: (item.seasons.find(s => s.season === (item.currentSeason || 1))?.episodes || 0) }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onIncrementEpisode(item)}
                className="next-button"
                title="Mark episode as watched and advance"
              >
                ➕ Next
              </button>
            </div>

            {item.currentSeason && (item.currentEpisode ?? 0) > 0 && item.status !== 'completed' && (
              <div className="watch-status">
                Currently watching: Season {item.currentSeason}, Episode {item.currentEpisode}
              </div>
            )}
          </div>
        )}

        <div className="detail-notes">
          <textarea
            value={item.notes || ''}
            onChange={(e) => onNotesChange(item, e.target.value)}
            placeholder="Add notes about this item..."
            className="notes-textarea"
          />
        </div>

        <button
          onClick={() => {
            onRemove(item.id);
            onClose();
          }}
          className="remove-button"
        >
          🗑️ Remove from Watchlist
        </button>
      </div>
    </div>
  </div>
);

export function WatchlistComponent({ items, mediaType, onUpdate, onRemove }: WatchlistComponentProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const handleStatusChange = async (item: WatchlistItem, newStatus: 'plan-to-watch' | 'watching' | 'waiting-for-next-ep' | 'on-hold' | 'dropped' | 'completed') => {
    const updated = { ...item, status: newStatus };
    await WatchlistStorage.save(updated);
    onUpdate(updated);
  };

  const handleNotesChange = async (item: WatchlistItem, notes: string) => {
    const updated = { ...item, notes };
    await WatchlistStorage.save(updated);
    onUpdate(updated);
  };

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      await WatchlistStorage.remove(id);
      onRemove(id);
    }
  };

  const handleCurrentSeasonChange = async (item: WatchlistItem, season: number) => {
    const updated = { ...item, currentSeason: season };
    await WatchlistStorage.save(updated);
    onUpdate(updated);
  };

  const handleCurrentEpisodeChange = async (item: WatchlistItem, episode: number) => {
    const updated = { ...item, currentEpisode: episode };
    await WatchlistStorage.save(updated);
    onUpdate(updated);
  };

  const incrementEpisode = async (item: WatchlistItem) => {
    const currentSeason = item.currentSeason || 1;
    const currentEpisode = item.currentEpisode || 0;
    const seasonData = (item.seasons || []).find(s => s.season === currentSeason);
    
    if (!seasonData) return;
    
    if (currentEpisode < seasonData.episodes) {
      // Not at end of season, increment episode
      const updated = { ...item, currentEpisode: currentEpisode + 1 };
      await WatchlistStorage.save(updated);
      onUpdate(updated);
    } else {
      // At or past end of season, move to next season
      const nextSeason = currentSeason + 1;
      const nextSeasonData = (item.seasons || []).find(s => s.season === nextSeason);
      if (nextSeasonData) {
        const updated = { ...item, currentSeason: nextSeason, currentEpisode: 1 };
        await WatchlistStorage.save(updated);
        onUpdate(updated);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'plan-to-watch':
        return '📋';
      case 'watching':
        return '👀';
      case 'waiting-for-next-ep':
        return '⏳';
      case 'on-hold':
        return '⏸️';
      case 'dropped':
        return '🚫';
      case 'completed':
        return '✅';
      default:
        return '❓';
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'tv':
        return '📺';
      case 'anime':
        return '🎨';
      default:
        return '🎭';
    }
  };

  const groupedItems = {
    'plan-to-watch': items.filter(i => i.status === 'plan-to-watch'),
    watching: items.filter(i => i.status === 'watching'),
    'waiting-for-next-ep': items.filter(i => i.status === 'waiting-for-next-ep'),
    'on-hold': items.filter(i => i.status === 'on-hold'),
    dropped: items.filter(i => i.status === 'dropped'),
    completed: items.filter(i => i.status === 'completed'),
  };

  const totalItems = items.length;

  const RenderItemCard = ({ item }: { item: WatchlistItem }) => (
    <div className="watchlist-item-card">
      <div 
        className="item-poster" 
        onClick={() => setSelectedItem(item.id)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={tmdbService.getImageUrl(item.posterPath || '', 300)}
          alt={item.title}
          className="item-poster-image"
        />
      </div>
      <div className="item-content">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <div className="item-badges">
            <span className="type-badge">{getMediaTypeIcon(item.mediaType)}</span>
            <span className="rating-badge">⭐ {item.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="item-date">📅 {new Date(item.releaseDate).getFullYear()}</p>
        <p className="item-overview">{item.overview}</p>
      </div>
    </div>
  );

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h2>
          {mediaType === 'movie' ? '🎬 Movies' : mediaType === 'tv' ? '📺 TV Shows' : '🎨 Anime'}
        </h2>
        <div className="watchlist-stats">
          <div 
            className={`stat ${statusFilter === null ? 'active' : ''}`}
            onClick={() => setStatusFilter(null)}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{totalItems}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div 
            className={`stat ${statusFilter === 'plan-to-watch' ? 'active' : ''}`}
            onClick={() => setStatusFilter('plan-to-watch')}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{groupedItems['plan-to-watch'].length}</span>
            <span className="stat-label">Plan to Watch</span>
          </div>
          <div 
            className={`stat ${statusFilter === 'watching' ? 'active' : ''}`}
            onClick={() => setStatusFilter('watching')}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{groupedItems.watching.length}</span>
            <span className="stat-label">Watching</span>
          </div>
          {(mediaType === 'tv' || mediaType === 'anime') && (
            <div 
              className={`stat ${statusFilter === 'waiting-for-next-ep' ? 'active' : ''}`}
              onClick={() => setStatusFilter('waiting-for-next-ep')}
              style={{ cursor: 'pointer' }}
            >
              <span className="stat-value">{groupedItems['waiting-for-next-ep'].length}</span>
              <span className="stat-label">Waiting</span>
            </div>
          )}
          <div 
            className={`stat ${statusFilter === 'on-hold' ? 'active' : ''}`}
            onClick={() => setStatusFilter('on-hold')}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{groupedItems['on-hold'].length}</span>
            <span className="stat-label">On Hold</span>
          </div>
          <div 
            className={`stat ${statusFilter === 'dropped' ? 'active' : ''}`}
            onClick={() => setStatusFilter('dropped')}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{groupedItems.dropped.length}</span>
            <span className="stat-label">Dropped</span>
          </div>
          <div 
            className={`stat ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-value">{groupedItems.completed.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {mediaType === 'movie' ? '🎬' : mediaType === 'tv' ? '📺' : '🎨'}
          </div>
          <h3>No {mediaType === 'movie' ? 'movies' : mediaType === 'tv' ? 'TV shows' : 'anime'} yet</h3>
          <p>Search and add {mediaType === 'movie' ? 'movies' : mediaType === 'tv' ? 'TV shows' : 'anime'} to get started!</p>
        </div>
      ) : (
        <div className="watchlist-sections">
          {(() => {
            const movieStatuses = ['plan-to-watch', 'watching', 'on-hold', 'dropped', 'completed'] as const;
            const tvStatuses = ['plan-to-watch', 'watching', 'waiting-for-next-ep', 'on-hold', 'dropped', 'completed'] as const;
            const statuses = mediaType === 'movie' ? movieStatuses : tvStatuses;
            
            return statuses.map((status) => {
              if (statusFilter !== null && statusFilter !== status) return null;
              const statusKey = status as keyof typeof groupedItems;
              return (
                groupedItems[statusKey].length > 0 && (
                  <div key={status} className="watchlist-section">
                    <div className="section-header">
                      <h3>
                        {getStatusIcon(status)}{' '}
                        {status === 'plan-to-watch'
                          ? 'Plan to Watch'
                          : status === 'watching'
                          ? 'Watching'
                          : status === 'waiting-for-next-ep'
                          ? 'Waiting for Next Episode'
                          : status === 'on-hold'
                          ? 'On Hold'
                          : status === 'dropped'
                          ? 'Dropped'
                          : 'Completed'}
                      </h3>
                      <span className="section-count">({groupedItems[statusKey].length})</span>
                    </div>
                    <div className="items-grid">
                      {groupedItems[statusKey].map((item: WatchlistItem) => (
                        <RenderItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )
              );
            });
          })()}
        </div>
      )}

      {selectedItem && (
        <DetailPanel
          item={items.find(i => i.id === selectedItem)!}
          mediaType={mediaType}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
          onNotesChange={handleNotesChange}
          onRemove={handleRemove}
          onCurrentSeasonChange={handleCurrentSeasonChange}
          onCurrentEpisodeChange={handleCurrentEpisodeChange}
          onIncrementEpisode={incrementEpisode}
        />
      )}
    </div>
  );
}
