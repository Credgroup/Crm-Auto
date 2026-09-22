import { create } from 'zustand';
import { Notification } from '@/types';

const NOTIFICATIONS_KEY = "$n071Ei4ti8n";

interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
    loadNotifications: () => void;
    clearNotifications: () => void;
    editNotification: (notification: Notification) => void;
    markAllAsRead: () => void;
}

function getNotificationsFromStorage(): Notification[] {
    try {
        const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
        if (!notifications) return [];
        return JSON.parse(notifications);
    } catch (error) {
        console.error('Erro ao carregar notificações do localStorage:', error);
        return [];
    }
}

function saveNotificationsToStorage(notifications: Notification[]): void {
    try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error('Erro ao salvar notificações no localStorage:', error);
    }
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: getNotificationsFromStorage(),
    
    addNotification: (notification: Notification) => {
        const currentNotifications = get().notifications;
        const newNotifications = [notification, ...currentNotifications];
        
        saveNotificationsToStorage(newNotifications);
        set({ notifications: newNotifications });
    },
    
    loadNotifications: () => {
        const storedNotifications = getNotificationsFromStorage();
        set({ notifications: storedNotifications });
    },
    
    clearNotifications: () => {
        saveNotificationsToStorage([]);
        set({ notifications: [] });
    },
    
    editNotification: (notification: Notification) => {
        const currentNotifications = get().notifications;
        const newNotifications = currentNotifications.map(n => n.id === notification.id ? notification : n);
        saveNotificationsToStorage(newNotifications);
        set({ notifications: newNotifications });
    },
    
    markAllAsRead: () => {
        const currentNotifications = get().notifications;
        const newNotifications = currentNotifications.map(n => ({ ...n, status: 2 }));
        saveNotificationsToStorage(newNotifications);
        set({ notifications: newNotifications });
    },

    setNotifications: (ns) =>{
        saveNotificationsToStorage(ns);
        set({ notifications: ns });
    }
}));
