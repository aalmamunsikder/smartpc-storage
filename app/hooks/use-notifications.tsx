'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationType } from '@/lib/types';
import { useToast } from './use-toast';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock initial notifications for demo
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'mock1',
    title: 'Welcome to SmartPC Desktop',
    message: 'Thanks for installing our app. Explore the features!',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 'mock2',
    title: 'Storage Almost Full',
    message: 'Your cloud storage is at 85% capacity',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 'mock3',
    title: 'Backup Complete',
    message: 'Your weekly backup has completed successfully',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
  },
];

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Load notifications from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        // Parse dates correctly from JSON
        const parsedNotifications = JSON.parse(savedNotifications, (key, value) => {
          return key === 'timestamp' ? new Date(value) : value;
        });
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications from storage', error);
    }
  }, []);
  
  // Save notifications to storage when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to storage', error);
    }
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}; 