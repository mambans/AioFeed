import addSystemNotification from './addSystemNotification';
import { getLocalstorage } from '../../../util';
import loginNameFormat from '../loginNameFormat';
import moment from 'moment';
import { durationMsToDate } from '../TwitchUtils';

const offlineStreamsPromise = async ({
  oldLiveStreams,
  liveStreams,
  isEnabledOfflineNotifications,
  fetchLatestVod,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newOffline = oldLiveStreams.current?.filter(
        (stream) => !liveStreams.current.find(({ user_id }) => stream.user_id === user_id)
      );

      if (newOffline?.length <= 0) reject('No new Offline streams');
      resolve(newOffline);
    });

    const streams = res.map((stream) => {
      stream.notiStatus = 'Offline';
      stream.onClick = () =>
        window.open(
          'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name) + '/page'
        );

      if (
        isEnabledOfflineNotifications &&
        getLocalstorage('TwitchVods-Channels')?.includes(stream.user_id)
      ) {
        const duration = durationMsToDate(moment().diff(moment(stream.started_at)));

        addSystemNotification({
          title: `${loginNameFormat(stream)} went Offline`,
          icon: stream?.profile_image_url,
          body: `Was live for ${duration}`,
          onClick: (e) => {
            e.preventDefault();
            window.open(
              `https://aiofeed.com/${stream.login || stream.user_login || stream.user_name}/page`
            );
          },
        });
      }

      if (fetchLatestVod) fetchLatestVod({ user_id: stream.user_id, check: true });

      return stream;
    });

    return streams;
  } catch (e) {
    return [];
  }
};
export default offlineStreamsPromise;
