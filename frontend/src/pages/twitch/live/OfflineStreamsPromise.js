import addSystemNotification from './addSystemNotification';
import { getLocalstorage } from '../../../util';

const offlineStreamsPromise = async ({
  oldLiveStreams,
  liveStreams,
  isEnabledOfflineNotifications,
  fetchLatestVod,
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

      // setTimeout(() => fetchLatestVod({ user_id: stream.user_id, check: true }), 0);

      return stream;
    });

    return streams;
  } catch (e) {
    return [];
  }
};
export default offlineStreamsPromise;
