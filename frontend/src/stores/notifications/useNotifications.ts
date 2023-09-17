import { create } from "zustand";
import addSystemNotification from "../../pages/twitch/live/addSystemNotification";
import { getLocalstorage } from "../../utilities";

type UseNotificationsStore = {
	notifications: StreamNotificationType[];
	addNotifications: (notifications: StreamNotificationType[]) => void;
	markAllAsRead: () => void;
};

const useNotificationsStore = create<UseNotificationsStore>((set, get) => ({
	notifications: getLocalstorage("notifications") || [],

	addNotifications: (notifications: StreamNotificationType[]) => {
		notifications.forEach((stream) => {
			addSystemNotification(stream);
		});

		const notificationsWithKeys = notifications.map((notification: StreamNotificationType) => ({
			...notification,
			date: notification.date || new Date(),
			key: (notification.stream?.id || "") + Date.now() + notification.type,
		}));

		set((state: any) => ({
			notifications: [...state.notifications, ...notificationsWithKeys],
		}));
	},

	markAllAsRead: () => {
		set((state: any) => ({
			notifications: state.notifications.map((notification: any) => ({
				...notification,
				unread: false,
			})),
		}));
	},
}));

const useNotifications = () => useNotificationsStore((state: any) => state.notifications);
const useAddNotifications = () => useNotificationsStore((state: any) => state.addNotifications);
const useMarkNotificationsAsRead = () => useNotificationsStore((state: any) => state.markAllAsRead);

export { useNotifications, useAddNotifications, useMarkNotificationsAsRead };
