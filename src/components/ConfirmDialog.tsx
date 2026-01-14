import React from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div 
        className={`confirm-dialog ${isDangerous ? 'dangerous' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          {isDangerous ? '⚠️' : 'ℹ️'}
        </div>

        <h2 className="confirm-dialog-title">{title}</h2>
        <p className="confirm-dialog-message">{message}</p>

        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`confirm-dialog-button ${isDangerous ? 'dangerous' : 'confirm'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
