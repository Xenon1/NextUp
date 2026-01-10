import { useState, useEffect } from 'react';
import { configService } from '../services/configService';
import './ApiKeySetupModal.css';

interface ApiKeySetupModalProps {
  onApiKeySet: (apiKey: string) => void;
}

export function ApiKeySetupModal({ onApiKeySet }: ApiKeySetupModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (copiedNotification) {
      const timer = setTimeout(() => setCopiedNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedNotification]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('https://www.themoviedb.org/settings/api');
    setCopiedNotification(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your TMDB API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await configService.setApiKey(apiKey);
      onApiKeySet(apiKey);
    } catch (err) {
      setError('Failed to save API key. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-key-modal-overlay">
      <div className="api-key-modal">
        <div className="api-key-modal-content">
          <h2>🔑 Enter Your TMDB API Key</h2>
          <p>This app uses the TMDB (The Movie Database) API to fetch movie, TV show, and anime data.</p>
          
          <div className="api-key-instructions">
            <h3>How to get your API key:</h3>
            <ol>
              <li>
                Visit TMDB API Settings at:{' '}
                <code 
                  className="tmdb-url"
                  onClick={handleCopyUrl}
                >
                  https://www.themoviedb.org/settings/api
                </code>
              </li>
              <li>Create a TMDB account (if you don't have one)</li>
              <li>Click "Create" to get your API key</li>
              <li>Copy your API key and paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="apiKey">API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your TMDB API key here"
                disabled={loading}
                className="api-key-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>

          <p className="security-note">
            ✓ Your API key is stored securely in your home directory (~/.nextup/config.json) and is never sent anywhere except to TMDB.
          </p>
        </div>
      </div>

      {copiedNotification && (
        <div className="copy-notification">
          ✓ URL copied to clipboard!
        </div>
      )}
    </div>
  );
}
