import { getLocalstorage, setLocalStorage } from '../../util';
import YoutubeAPI, { pagination } from './API';

const getMyFollowedChannels = async () => {
  try {
    const channels = await pagination(
      await YoutubeAPI.getSubscriptions({
        maxResults: 50,
        mine: true,
        part: 'snippet',
        order: 'alphabetical',
      })
    );
    console.log('channels:', channels);

    const uniqueSubscriptions = channels.filter(
      (item, index, self) =>
        self.findIndex(
          (t) =>
            t.snippet.resourceId.channelId === item.snippet.resourceId.channelId &&
            t.snippet.title === item.snippet.title
        ) === index
    );

    setLocalStorage(`YT-followedChannels`, {
      data: uniqueSubscriptions,
      casheExpire: Date.now() + 12 * 60 * 60 * 1000,
    });

    return uniqueSubscriptions;
  } catch (error) {
    console.warn('error', error);
    console.log('Youtube: Followed-channels cache used.');
    if (getLocalstorage('YT-followedChannels')) return getLocalstorage('YT-followedChannels').data;

    return [];
  }
};

export default getMyFollowedChannels;
