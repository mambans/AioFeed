import loginNameFormat from './../loginNameFormat';

const markStreamAsSeen = async (streamName, newlyAddedStreams, setUnseenNotifications) => {
  new Promise(async (resolve, reject) => {
    if (setUnseenNotifications) {
      setUnseenNotifications((unseenNotifications) =>
        unseenNotifications.filter((value) => value !== streamName)
      );
    }

    if (!newlyAddedStreams) reject('Notification from Player');

    const newUnSeenStreams = await newlyAddedStreams.current.filter(
      (value) => value !== streamName
    );
    resolve(newUnSeenStreams);
  }).then((res) => {
    newlyAddedStreams.current = res;

    if (document.title?.length > 15 && res?.length > 0) {
      const title = document.title.substring(4);
      const count = parseInt(document.title.substring(1, 2)) - 1;
      document.title = `(${count}) ${title}`;
    } else if (res?.length === 0 && document.title !== 'AioFeed | Feed') {
      document.title = 'AioFeed | Feed';
    }
  });
};

const addSystemNotification = async ({
  status,
  stream,
  body,
  newlyAddedStreams,
  setUnseenNotifications,
}) => {
  if (Notification.permission === 'granted') {
    const url = `https://aiofeed.com/${stream.login?.toLowerCase()}${
      status?.toLowerCase() === 'offline' ? '/page' : ''
    }`;
    let notification = new Notification(`${loginNameFormat(stream)} ${status}`, {
      icon: stream?.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
      badge: stream?.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-192x192.webp`,
      body,
    });

    notification.onclick = async function (event) {
      event.preventDefault();
      await markStreamAsSeen(stream?.login, newlyAddedStreams, setUnseenNotifications);
      window.open(url, '_blank');
    };

    return notification;
  }
};
export default addSystemNotification;
