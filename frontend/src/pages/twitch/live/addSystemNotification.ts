const addSystemNotification = async ({ title, icon, body, onClick, requireInteraction = false }) => {
	if (Notification.permission === "granted") {
		const notification = new Notification(title, {
			icon: icon || `${process.env.PUBLIC_URL}/android-chrome-192x192.png`,
			badge: icon || `${process.env.PUBLIC_URL}/android-chrome-192x192.png`,
			body,
			requireInteraction,
		});

		if (onClick) notification.onclick = onClick;

		return notification;
	}
};
export default addSystemNotification;
