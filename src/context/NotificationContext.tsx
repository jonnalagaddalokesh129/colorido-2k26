import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem } from '../types/database';
import { store } from '../lib/store';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  sendNotification: (
    title: string,
    message: string,
    category?: 'reminder' | 'announcement' | 'result' | 'system' | 'checkin',
    priority?: 'normal' | 'important' | 'urgent',
    actionUrl?: string
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => store.getNotifications(user?.id));

  useEffect(() => {
    const update = () => {
      setNotifications(store.getNotifications(user?.id));
    };

    update();
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: string) => {
    store.markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    store.markAllNotificationsAsRead(user?.id);
    showToast('All notifications marked as read', 'info');
  };

  const sendNotification = (
    title: string,
    message: string,
    category: 'reminder' | 'announcement' | 'result' | 'system' | 'checkin' = 'system',
    priority: 'normal' | 'important' | 'urgent' = 'normal',
    actionUrl?: string
  ) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: user?.id,
      title,
      message,
      category,
      priority,
      is_read: false,
      action_url: actionUrl,
      created_at: new Date().toISOString()
    };
    store.addNotification(notif);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        sendNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
