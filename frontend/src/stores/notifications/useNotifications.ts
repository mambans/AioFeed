import { create } from "zustand";
import addSystemNotification from "../../pages/twitch/live/addSystemNotification";
import { getLocalstorage, setLocalStorage } from "../../utilities";
import moment from "moment";

type UseNotificationsStore = {
	notifications: StreamNotificationType[];
	addNotifications: (notifications: StreamNotificationType[]) => void;
	markAllAsRead: () => void;
	clearNotifications: () => void;
};

const useNotificationsStore = create<UseNotificationsStore>((set, get) => ({
	notifications: getLocalstorage("notifications") || [],

	addNotifications: (notifications: StreamNotificationType[]) => {
		const previouosNotifications = getLocalstorage("notifications") || [];

		notifications.forEach((stream) => {
			addSystemNotification(stream);
		});

		const notificationsWithKeys = notifications.map((notification: StreamNotificationType) => ({
			...notification,
			date: notification.date || moment().format("YYYY-MM-DD HH:mm:ss"),
			key: (notification.stream?.id || "") + Date.now() + notification.type,
		}));

		const newNotifications = [...notificationsWithKeys, ...previouosNotifications];

		setLocalStorage("notifications", newNotifications);

		set({
			notifications: newNotifications,
		});
	},

	markAllAsRead: () => {
		set({
			notifications: get().notifications.map((notification: any) => ({
				...notification,
				unread: false,
			})),
		});
	},

	clearNotifications: () => {
		setLocalStorage("notifications", []);

		set({ notifications: [] });
	},
}));

const useNotifications = () => useNotificationsStore((state: any) => state.notifications);
const useAddNotifications = () => useNotificationsStore((state: any) => state.addNotifications);
const useMarkNotificationsAsRead = () => useNotificationsStore((state: any) => state.markAllAsRead);
const useClearNotifications = () => useNotificationsStore((state: any) => state.clearNotifications);

export { useNotifications, useAddNotifications, useMarkNotificationsAsRead, useClearNotifications };
