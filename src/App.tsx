import { useState, useEffect } from 'react'
import { SearchComponent } from './components/SearchComponent'
import { WatchlistComponent } from './components/WatchlistComponent'
import { DashboardComponent } from './components/DashboardComponent'
import { ApiKeySetupModal } from './components/ApiKeySetupModal'
import UpdateModal from './components/UpdateModal'
import { NotificationProvider } from './components/NotificationContext'
import type { WatchlistItem } from './types'
import type { Release } from './services/releaseService'
import { WatchlistStorage } from './utils/watchlistStorage'
import { configService } from './services/configService'
import tmdbService from './services/tmdbService'
import releaseService from './services/releaseService'
import './App.css'

const APP_VERSION = '0.2.7'
type TabType = 'dashboard' | 'search' | 'movies' | 'tv' | 'anime'

function App() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [availableRelease, setAvailableRelease] = useState<Release | null>(null)
  const [loading, setLoading] = useState(true)

  // Load watchlist and API key on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Clear release cache if app version changed
        const lastSeenVersion = localStorage.getItem('nextup_app_version')
        if (lastSeenVersion !== APP_VERSION) {
          releaseService.clearCache()
          localStorage.setItem('nextup_app_version', APP_VERSION)
        }

        await configService.initialize()
        const apiKey = await configService.getApiKey()
        
        if (apiKey) {
          tmdbService.setApiKey(apiKey)
        } else {
          setShowApiKeySetup(true)
        }

        const saved = await WatchlistStorage.getAll()
        setWatchlist(saved)

        // Check for updates
        checkForUpdates()
      } catch (err) {
        console.error('Error initializing app:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initializeApp()
  }, [])

  const checkForUpdates = async () => {
    try {
      const newRelease = await releaseService.checkForUpdate(APP_VERSION)
      if (newRelease) {
        setAvailableRelease(newRelease)
        setShowUpdateModal(true)
      }
    } catch (err) {
      console.error('Error checking for updates:', err)
    }
  }

  const handleApiKeySet = async (apiKey: string) => {
    tmdbService.setApiKey(apiKey)
    setShowApiKeySetup(false)
  }

  const handleAddToWatchlist = (item: WatchlistItem) => {
    const existing = watchlist.find(w => w.id === item.id)
    if (!existing) {
      setWatchlist([...watchlist, item])
    }
  }

  const handleUpdateItem = (item: WatchlistItem) => {
    setWatchlist(watchlist.map(w => (w.id === item.id ? item : w)))
  }

  const handleRemoveItem = (id: string) => {
    setWatchlist(watchlist.filter(w => w.id !== id))
  }

  const getItemsForType = (mediaType: 'movie' | 'tv' | 'anime'): WatchlistItem[] => {
    return watchlist.filter(item => item.mediaType === mediaType)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#1a1a2e',
        color: '#e0e0e0',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    )
  }

  if (showApiKeySetup) {
    return <ApiKeySetupModal onApiKeySet={handleApiKeySet} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 NextUp</h1>
          <p className="subtitle">Your Personal Movie, TV Show & Anime Watchlist</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📺 Up Next
          </button>
          <button
            className={`nav-tab ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            🎬 Movies
          </button>
          <button
            className={`nav-tab ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => setActiveTab('tv')}
          >
            📺 TV Shows
          </button>
          <button
            className={`nav-tab ${activeTab === 'anime' ? 'active' : ''}`}
            onClick={() => setActiveTab('anime')}
          >
            🎨 Anime
          </button>
          <button
            className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search & Add
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' ? (
          <DashboardComponent items={watchlist} onUpdate={handleUpdateItem} />
        ) : activeTab === 'search' ? (
          <SearchComponent onAddToWatchlist={handleAddToWatchlist} />
        ) : (
          <WatchlistComponent
            items={getItemsForType(activeTab === 'movies' ? 'movie' : activeTab === 'tv' ? 'tv' : 'anime')}
            mediaType={activeTab === 'movies' ? 'movie' : activeTab === 'tv' ? 'tv' : 'anime'}
            onUpdate={handleUpdateItem}
            onRemove={handleRemoveItem}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          NextUp • Powered by{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            The Movie Database (TMDB)
          </a>
        </p>
      </footer>

      {showUpdateModal && availableRelease && (
        <UpdateModal
          release={availableRelease}
          currentVersion={APP_VERSION}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  )
}

function AppWithNotifications() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  )
}

export default AppWithNotifications
