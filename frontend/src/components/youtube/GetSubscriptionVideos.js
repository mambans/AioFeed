import axios from 'axios';
import { reverse, sortBy } from 'lodash';

import GetVideoInfo from './GetVideoInfo';
import { getCookie, getLocalstorage } from './../../util/Utils';

const filterTypeUpload = async (response) => {
  if (Boolean(response?.items?.length)) {
    return response.items.filter((video) => video?.snippet?.type === 'upload') || [];
  }
  return [];
};

const fetchSubscriptionVideos = async (videosCACHE, channel) => {
  const currentDate = new Date();
  const DATE_THRESHOLD = new Date(currentDate.setDate(currentDate.getDate() - 7));

  const checkForCachedChannel = () =>
    videosCACHE.find(
      (cacheChannel) =>
        cacheChannel?.channel?.snippet?.resourceId?.channelId ===
        channel?.snippet?.resourceId?.channelId
    );
  const cachedChannelObj = checkForCachedChannel();
  const staticHeaders = {
    Authorization: `Bearer ${getCookie('Youtube-access_token')}`,
    Accept: 'application/json',
  };
  const headers = cachedChannelObj
    ? {
        'If-None-Match': cachedChannelObj.channel.etag,
        ...staticHeaders,
      }
    : { ...staticHeaders };

  const res = await axios
    .get(`https://www.googleapis.com/youtube/v3/activities?`, {
      params: {
        part: 'snippet,contentDetails',
        channelId: channel?.snippet?.resourceId?.channelId,
        maxResults: 10,
        publishedAfter: DATE_THRESHOLD.toISOString(),
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
      headers: headers,
    })
    .then((result) => ({ channels: result.data }))
    .catch((e) => ({ channels: cachedChannelObj || null, error: e }));

  return res;
};

const getSubscriptionVideos = async (followedChannels) => {
  let error = null;

  try {
    const videosCACHE = getLocalstorage('YT-ChannelsObj') || [];

    const channelWithVideos = await Promise.all(
      followedChannels.map(
        async (channel) =>
          await fetchSubscriptionVideos(videosCACHE, channel).then(async (result) => {
            error = result.error;
            const items = await filterTypeUpload(result.channels);

            return { channel, items };
          })
      )
    );
    localStorage.setItem('YT-ChannelsObj', JSON.stringify(channelWithVideos));

    const videoOnlyArray = channelWithVideos.map((channel) =>
      Array.isArray(channel.items) ? channel.items : null
    );

    const flattedVideosArray = videoOnlyArray.flat(1).filter((items) => items);

    const videosWithDetails = await GetVideoInfo({ videos: flattedVideosArray });

    const sortedVideos = reverse(
      sortBy(videosWithDetails, (video) => video?.snippet?.publishedAt)
    ).filter((i) => i);

    return { data: sortedVideos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export default getSubscriptionVideos;
