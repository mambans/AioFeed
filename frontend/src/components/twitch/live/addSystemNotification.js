import loginNameFormat from './../loginNameFormat';

const markStreamAsSeen = async (streamName, newlyAddedStreams, setUnseenNotifications) => {
  new Promise(async (resolve, reject) => {
    if (setUnseenNotifications) {
      setUnseenNotifications((unseenNotifications) => {
        return unseenNotifications.filter((value) => {
          return value !== streamName;
        });
      });
    }

    if (!newlyAddedStreams) reject('Notification from Player');

    const newUnSeenStreams = await newlyAddedStreams.current.filter((value) => {
      return value !== streamName;
    });
    resolve(newUnSeenStreams);
  }).then((res) => {
    newlyAddedStreams.current = res;

    if (document.title.length > 15 && res.length > 0) {
      const title = document.title.substring(4);
      const count = parseInt(document.title.substring(1, 2)) - 1;
      document.title = `(${count}) ${title}`;
    } else if (res.length === 0 && document.title !== 'AioFeed | Feed') {
      document.title = 'AioFeed | Feed';
    }
  });
};

export default async ({ status, stream, body, newlyAddedStreams, setUnseenNotifications }) => {
  if (Notification.permission === 'granted') {
    const url = `https://aiofeed.com/${stream.login.toLowerCase()}${
      status?.toLowerCase() === 'offline' ? '/channel' : ''
    }`;
    let notification = new Notification(`${loginNameFormat(stream)} ${status}`, {
      icon: stream.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
      badge: stream.profile_image_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
      body,
    });

    notification.onclick = async function (event) {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      await markStreamAsSeen(stream.login, newlyAddedStreams, setUnseenNotifications);
      window.open(url, '_blank');
    };

    return notification;
  }
};
