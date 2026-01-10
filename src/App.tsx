import { useState, useEffect } from 'react'
import { SearchComponent } from './components/SearchComponent'
import { WatchlistComponent } from './components/WatchlistComponent'
import { DashboardComponent } from './components/DashboardComponent'
import { ApiKeySetupModal } from './components/ApiKeySetupModal'
import type { WatchlistItem } from './types'
import { WatchlistStorage } from './utils/watchlistStorage'
import { configService } from './services/configService'
import tmdbService from './services/tmdbService'
import './App.css'

type TabType = 'dashboard' | 'search' | 'movies' | 'tv' | 'anime'

function App() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load watchlist and API key on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await configService.initialize()
        const apiKey = await configService.getApiKey()
        
        if (apiKey) {
          tmdbService.setApiKey(apiKey)
        } else {
          setShowApiKeySetup(true)
        }

        const saved = await WatchlistStorage.getAll()
        setWatchlist(saved)
      } catch (err) {
        console.error('Error initializing app:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initializeApp()
  }, [])

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

  const movieCount = getItemsForType('movie').length
  const tvCount = getItemsForType('tv').length
  const animeCount = getItemsForType('anime').length

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
            🎬 Movies {movieCount > 0 && <span className="tab-count">{movieCount}</span>}
          </button>
          <button
            className={`nav-tab ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => setActiveTab('tv')}
          >
            📺 TV Shows {tvCount > 0 && <span className="tab-count">{tvCount}</span>}
          </button>
          <button
            className={`nav-tab ${activeTab === 'anime' ? 'active' : ''}`}
            onClick={() => setActiveTab('anime')}
          >
            🎨 Anime {animeCount > 0 && <span className="tab-count">{animeCount}</span>}
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
    </div>
  )
}

export default App
