import React, { useState } from 'react';
import { Release } from '../services/releaseService';
import './UpdateModal.css';

interface UpdateModalProps {
  release: Release;
  currentVersion: string;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  release,
  currentVersion,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const newVersion = release.tag_name.replace(/^v/, '');
  const changelogUrl = release.html_url;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(changelogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRelease = () => {
    // Copy link and open (since we can't use shell plugin)
    handleCopyLink();
    // Show notification that link is copied
    alert(`Changelog link copied! Open it in your browser:\n\n${changelogUrl}`);
  };

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-modal-header">
          <h2>🎉 New Version Available!</h2>
          <button className="update-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="update-modal-content">
          <div className="version-info">
            <div className="version-current">
              <span className="label">Current Version:</span>
              <span className="version">{currentVersion}</span>
            </div>
            <div className="version-arrow">→</div>
            <div className="version-new">
              <span className="label">New Version:</span>
              <span className="version">{newVersion}</span>
            </div>
          </div>

          <div className="release-info">
            <p className="release-date">
              Released: {new Date(release.published_at).toLocaleDateString()}
            </p>

            <div className="changelog-section">
              <h3>What's New:</h3>
              <div className="changelog-preview">
                {release.body
                  ? release.body.substring(0, 300)
                  : 'Check the release page for details.'}
                {release.body && release.body.length > 300 ? '...' : ''}
              </div>
            </div>
          </div>

          <div className="update-modal-actions">
            <button
              className="btn btn-secondary"
              onClick={handleCopyLink}
              title="Copy changelog link"
            >
              {copied ? '✓ Copied!' : '📋 Copy Changelog Link'}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleOpenRelease}
              title="View full changelog"
            >
              📖 View Full Changelog
            </button>
          </div>

          <p className="update-note">
            Download the latest version from{' '}
            <a
              href="https://github.com/Xenon1/NextUp/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Releases
            </a>
          </p>
        </div>

        <div className="update-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
