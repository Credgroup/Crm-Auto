import { useNotificationStore } from "@/store/notificationStore";

export default function useNotificationHook() {
    const { notifications, addNotification, loadNotifications, editNotification, clearNotifications, markAllAsRead, setNotifications } = useNotificationStore();

    return {
        notifications,
        addNotification,
        loadNotifications,
        editNotification,
        clearNotifications,
        markAllAsRead, 
        setNotifications
    }
}
