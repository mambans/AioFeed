import addSystemNotification from './addSystemNotification';
import FetchSingelChannelVods from './../vods/FetchSingelChannelVods';
import { getLocalstorage } from '../../../util';

const liveStreamsPromise = async ({
  liveStreams,
  oldLiveStreams,
  setVods,
  enableTwitchVods,
  setNewlyAddedStreams,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newLive = liveStreams?.filter((stream) => {
        return !oldLiveStreams.current.find(({ user_id }) => stream.user_id === user_id);
      });
      if (newLive?.length <= 0) reject('No new LIVE streams');
      resolve(newLive);
    });

    res?.map((stream) => {
      setNewlyAddedStreams((c) => [...(c || []), stream.user_name]);
      stream.newlyAdded = true;
      stream.notiStatus = 'Live';
      addSystemNotification({
        status: 'Live',
        stream: stream,
        body: `${stream.title || stream.status || ''}\n${stream.game_name || stream.game || ''}`,
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
export default liveStreamsPromise;
