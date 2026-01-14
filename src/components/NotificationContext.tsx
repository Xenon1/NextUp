import React, { useState, useCallback } from 'react';
import './NotificationContext.css';
import { NotificationContext } from '../hooks/useNotification';
import type { NotificationType, Notification } from '../hooks/useNotification';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'info', duration: number = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      message,
      type,
      duration,
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, [removeNotification]);

  const confirm = useCallback((message: string, onConfirm: () => void, onCancel?: () => void) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      message,
      type: 'info',
      duration: 0, // Don't auto-dismiss
      action: {
        label: 'Confirm',
        onConfirm: () => {
          onConfirm();
          removeNotification(id);
        },
        onCancel: () => {
          onCancel?.();
          removeNotification(id);
        },
      },
    };

    setNotifications(prev => [...prev, notification]);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify, confirm, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};



interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{notification.message}</span>
        {notification.action && (
          <div className="notification-actions">
            <button
              className="notification-button notification-confirm"
              onClick={notification.action.onConfirm}
            >
              {notification.action.label}
            </button>
            <button
              className="notification-button notification-cancel"
              onClick={notification.action.onCancel || onRemove}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {!notification.action && (
        <button className="notification-close" onClick={onRemove}>
          ✕
        </button>
      )}
    </div>
  );
};
