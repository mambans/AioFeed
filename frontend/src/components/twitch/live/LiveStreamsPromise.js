import addSystemNotification from './addSystemNotification';
import FetchSingelChannelVods from './../vods/FetchSingelChannelVods';
import { getLocalstorage } from '../../../util/Utils';

export default async ({
  liveStreams,
  oldLiveStreams,
  newlyAddedStreams,
  setVods,
  enableTwitchVods,
  setUnseenNotifications,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newLive = liveStreams.current.filter((stream) => {
        return !oldLiveStreams.current.find(({ user_id }) => stream.user_id === user_id);
      });
      if (newLive?.length <= 0) reject('No new LIVE streams');
      resolve(newLive);
    });
    if (document.title?.length > 15) {
      const title = document.title.substring(4);
      const count = parseInt(document.title.substring(1, 2)) + res?.length;
      document.title = `(${count}) ${title}`;
    } else {
      const title_1 = document.title;
      document.title = `(${1}) ${title_1}`;
    }

    res.map((stream) => {
      newlyAddedStreams.current.push(stream.user_name);
      stream.newlyAdded = true;
      stream.notiStatus = 'Live';
      addSystemNotification({
        status: 'Live',
        stream: stream,
        body: `${stream.title || stream.status}\n${stream.game_name || stream.game}`,
        newlyAddedStreams: newlyAddedStreams,
        setUnseenNotifications: setUnseenNotifications,
      });
      if (
        enableTwitchVods &&
        getLocalstorage('TwitchVods-Channels')?.includes(stream.user_name?.toLowerCase())
      ) {
        setTimeout(async () => {
          await FetchSingelChannelVods({ channelId: stream.user_id, setVods });
        }, 30000);
      }
      return '';
    });
    return res;
  } catch (e) {
    return [];
  }
};
