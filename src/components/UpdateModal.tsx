import React, { useState } from 'react';
import type { Release } from '../services/releaseService';
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
  const releaseUrl = 'https://github.com/Xenon1/NextUp/releases/latest';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(releaseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <div className="changelog-preview">
                {release.body
                  ? (() => {
                      const lines = release.body.split('\n');
                      const filtered: string[] = [];
                      let captureContent = false;

                      for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        const trimmed = line.trim().toLowerCase();
                        const isHeading = line.trim().startsWith('#');

                        // Start capturing for relevant sections
                        if (isHeading) {
                          if (trimmed.includes("what's new") || 
                              trimmed.includes("what's changed") ||
                              trimmed.includes("what's fixed") ||
                              trimmed.includes("added") ||
                              trimmed.includes("changed") ||
                              trimmed.includes("fixed")) {
                            captureContent = true;
                            filtered.push(line);
                          } else if (captureContent) {
                            // Stop capturing when we hit a different heading
                            captureContent = false;
                          }
                        } else if (captureContent) {
                          // Add content if we're in a capture section
                          filtered.push(line);
                        }
                      }

                      // Render the filtered content with proper grouping
                      const elements: React.ReactNode[] = [];
                      let ulItems: React.ReactNode[] = [];

                      filtered.forEach((line, idx) => {
                        if (line.trim().startsWith('##')) {
                          if (ulItems.length > 0) {
                            elements.push(<ul key={`ul-${idx}`}>{ulItems}</ul>);
                            ulItems = [];
                          }
                          const text = line.replace(/^#+\s*/, '');
                          elements.push(<h2 key={idx}>{text}</h2>);
                        } else if (line.trim().startsWith('###')) {
                          if (ulItems.length > 0) {
                            elements.push(<ul key={`ul-${idx}`}>{ulItems}</ul>);
                            ulItems = [];
                          }
                          const text = line.replace(/^#+\s*/, '');
                          elements.push(<h3 key={idx}>{text}</h3>);
                        } else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                          const text = line.replace(/^[-*]\s*/, '');
                          ulItems.push(<li key={idx}>{text}</li>);
                        } else if (line.trim() === '') {
                          if (ulItems.length > 0) {
                            elements.push(<ul key={`ul-${idx}`}>{ulItems}</ul>);
                            ulItems = [];
                          }
                          elements.push(<div key={idx} style={{ height: '8px' }} />);
                        } else if (line.trim()) {
                          if (ulItems.length > 0) {
                            elements.push(<ul key={`ul-${idx}`}>{ulItems}</ul>);
                            ulItems = [];
                          }
                          elements.push(<p key={idx}>{line}</p>);
                        }
                      });

                      if (ulItems.length > 0) {
                        elements.push(<ul key="ul-final">{ulItems}</ul>);
                      }

                      return <div>{elements}</div>;
                    })()
                  : 'Check the release page for details.'}
              </div>
            </div>
          </div>

          <p className="update-note">
            <button
              className="btn btn-primary"
              onClick={handleCopyLink}
              title="Copy link to latest release"
            >
              {copied ? '✓ Copied!' : '📋 Copy Link to Latest Release'}
            </button>
          </p>
        </div>

        <div className="update-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
