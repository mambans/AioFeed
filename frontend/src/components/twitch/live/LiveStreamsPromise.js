import addSystemNotification from './addSystemNotification';
import FetchSingelChannelVods from './../vods/FetchSingelChannelVods';
import { getLocalstorage } from '../../../util/Utils';

const liveStreamsPromise = async ({
  liveStreams,
  oldLiveStreams,
  newlyAddedStreams,
  setVods,
  enableTwitchVods,
  setUnseenNotifications,
  setDocumentTitle,
  documentTitle,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newLive = liveStreams.current.filter((stream) => {
        return !oldLiveStreams.current.find(({ user_id }) => stream.user_id === user_id);
      });
      if (newLive?.length <= 0) reject('No new LIVE streams');
      resolve(newLive);
    });
    const currentCount =
      parseInt(
        documentTitle.substring(documentTitle.indexOf('(') + 1, documentTitle.lastIndexOf(')'))
      ) || 0;
    setDocumentTitle(`(${currentCount + res?.length}) Feed`);

    res.map((stream) => {
      newlyAddedStreams.current.push(stream.user_name);
      stream.newlyAdded = true;
      stream.notiStatus = 'Live';
      addSystemNotification({
        status: 'Live',
        stream: stream,
        body: `${stream.title || stream.status || ''}\n${stream.game_name || stream.game || ''}`,
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
export default liveStreamsPromise;
