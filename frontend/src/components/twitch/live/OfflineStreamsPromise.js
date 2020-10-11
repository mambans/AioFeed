import addSystemNotification from './addSystemNotification';
import FetchSingelChannelVods from './../vods/FetchSingelChannelVods';
import { getLocalstorage } from '../../../util/Utils';

export default async ({
  oldLiveStreams,
  liveStreams,
  isEnabledOfflineNotifications,
  newlyAddedStreams,
  setUnseenNotifications,
  enableTwitchVods,
  setVods,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newOffline = oldLiveStreams.current?.filter(
        (stream) => !liveStreams.current.find(({ user_name }) => stream.user_name === user_name)
      );

      if (newOffline?.length <= 0) reject('No new Offline streams');
      resolve(newOffline);
    });

    res.map((stream) => {
      stream.notiStatus = 'Offline';
      if (
        isEnabledOfflineNotifications &&
        getLocalstorage('TwitchVods-Channels')?.includes(stream.user_name?.toLowerCase())
      )
        addSystemNotification({
          status: 'Offline',
          stream: stream,
          newlyAddedStreams: newlyAddedStreams,
          setUnseenNotifications: setUnseenNotifications,
          body: '',
        });

      if (
        enableTwitchVods &&
        getLocalstorage('TwitchVods-Channels')?.includes(stream.user_name?.toLowerCase())
      ) {
        setTimeout(async () => {
          await FetchSingelChannelVods({ channelId: stream.user_id, setVods });
        }, 0);
      }
      return '';
    });

    return res;
  } catch (e) {
    return [];
  }
};
