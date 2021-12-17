import loginNameFormat from '../loginNameFormat';

const addSystemNotification = async ({ status, stream, body }) => {
  if (Notification.permission === 'granted') {
    const url = `https://aiofeed.com/${(
      stream.login ||
      stream.user_name ||
      stream.name ||
      stream.display_name ||
      stream.broadcaster_name
    )?.toLowerCase()}${status?.toLowerCase() === 'offline' ? '/page' : ''}`;
    let notification = new Notification(`${loginNameFormat(stream)} ${status}`, {
      icon: stream?.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
      badge: stream?.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
      body,
    });

    notification.onclick = async function (event) {
      event.preventDefault();
      window.open(url, '_blank');
    };

    return notification;
  }
};
export default addSystemNotification;
