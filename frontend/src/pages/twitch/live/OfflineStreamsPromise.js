import addSystemNotification from './addSystemNotification';
import FetchSingelChannelVods from './../vods/FetchSingelChannelVods';
import { getLocalstorage } from '../../../util';

const offlineStreamsPromise = async ({
  oldLiveStreams,
  liveStreams,
  isEnabledOfflineNotifications,
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

    const streams = res.map((stream) => {
      stream.notiStatus = 'Offline';
      stream.onClick = () =>
        window.open('https://aiofeed.com/' + (stream.login || stream.user_name) + '/page');

      if (
        isEnabledOfflineNotifications &&
        getLocalstorage('TwitchVods-Channels')?.includes(stream.user_id)
      )
        addSystemNotification({
          status: 'Offline',
          stream: stream,
          body: '',
        });

      if (enableTwitchVods && getLocalstorage('TwitchVods-Channels')?.includes(stream.user_id)) {
        setTimeout(async () => {
          await FetchSingelChannelVods({ user_id: stream.user_id, setVods });
        }, 0);
      }
      return stream;
    });

    return streams;
  } catch (e) {
    return [];
  }
};
export default offlineStreamsPromise;
