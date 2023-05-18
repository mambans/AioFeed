const addSystemNotification = async ({ title, icon, body, onClick }) => {
	if (Notification.permission === "granted") {
		let notification = new Notification(title, {
			icon: icon || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
			badge: icon || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
			body,
		});

		if (onClick) notification.onclick = onClick;

		return notification;
	}
};
export default addSystemNotification;
