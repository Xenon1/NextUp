import { createContext, useContext } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // ms, 0 = no auto-dismiss
  action?: {
    label: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
}

export interface NotificationContextType {
  notify: (message: string, type?: NotificationType, duration?: number) => void;
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
