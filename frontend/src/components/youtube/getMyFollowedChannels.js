import axios from 'axios';
import { getCookie, getLocalstorage } from '../../util';

const fetchNextPgeOfSubscriptions = async ({ total, PagePagination, followedchannels }) => {
  if (followedchannels?.length < total && PagePagination) {
    const nextPage = await axios
      .get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
        params: {
          maxResults: Math.min(Math.max(parseInt(total - followedchannels?.length), 0), 50),
          mine: true,
          part: 'snippet',
          order: 'alphabetical',
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          pageToken: PagePagination,
        },
        headers: {
          Authorization: 'Bearer ' + getCookie('Youtube-access_token'),
          Accept: 'application/json',
        },
      })
      .catch((error) => {
        console.log(error);
      });

    const channels = [...followedchannels, ...nextPage?.data?.items];

    if (channels?.length < total && nextPage?.data?.nextPageToken) {
      return await fetchNextPgeOfSubscriptions({
        total: total,
        PagePagination: nextPage?.data?.nextPageToken,
        followedchannels: channels,
      });
    }
    return channels;
  }
  return followedchannels;
};

const getMyFollowedChannels = async () => {
  try {
    const followedchannels = await axios.get(
      `https://www.googleapis.com/youtube/v3/subscriptions?`,
      {
        params: {
          maxResults: 50,
          mine: true,
          part: 'snippet',
          order: 'alphabetical',
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: 'Bearer ' + getCookie('Youtube-access_token'),
          Accept: 'application/json',
        },
      }
    );
    const channels = await fetchNextPgeOfSubscriptions({
      total: followedchannels.data.pageInfo.totalResults,
      PagePagination: followedchannels.data.nextPageToken,
      followedchannels: followedchannels.data.items,
    });

    const uniqueSubscriptions = channels.filter(
      (item, index, self) =>
        self.findIndex(
          (t) =>
            t.snippet.resourceId.channelId === item.snippet.resourceId.channelId &&
            t.snippet.title === item.snippet.title
        ) === index
    );

    localStorage.setItem(
      `YT-followedChannels`,
      JSON.stringify({
        data: uniqueSubscriptions,
        casheExpire: Date.now() + 12 * 60 * 60 * 1000,
      })
    );

    return uniqueSubscriptions;
  } catch (error) {
    console.warn('error', error);
    console.log('Youtube: Followed-channels cache used.');
    if (getLocalstorage('YT-followedChannels')) return getLocalstorage('YT-followedChannels').data;

    return [];
  }
};

export default getMyFollowedChannels;
