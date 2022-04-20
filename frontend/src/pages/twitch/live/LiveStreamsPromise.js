import loginNameFormat from '../loginNameFormat';
import addSystemNotification from './addSystemNotification';

const liveStreamsPromise = async ({
  liveStreams,
  oldLiveStreams,
  setNewlyAddedStreams,
  fetchLatestVod,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newLive = liveStreams?.filter((stream) => {
        return !oldLiveStreams.current.find(({ user_id }) => stream.user_id === user_id);
      });
      if (newLive?.length <= 0) reject('No new LIVE streams');
      resolve(newLive);
    });

    setNewlyAddedStreams((c) => [...(c || []), ...res?.map(({ user_name } = {}) => user_name)]);

    const streams = res?.map((stream) => {
      stream.newlyAdded = true;
      stream.notiStatus = 'Live';
      stream.onClick = () =>
        window.open(
          'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
        );

      addSystemNotification({
        title: `${loginNameFormat(stream)} is Live`,
        icon: stream?.profile_image_url,
        body: `${stream.title || stream.status || ''}\n${stream.game_name || stream.game || ''}`,
        onClick: (e) => {
          e.preventDefault();
          window.open(
            'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
          );
        },
      });

      if (fetchLatestVod) {
        setTimeout(() => fetchLatestVod({ user_id: stream.user_id, check: true }), 30000);
      }

      return stream;
    });
    return streams;
  } catch (e) {
    return [];
  }
};
export default liveStreamsPromise;
