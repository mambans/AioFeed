import axios from "axios";
import { reverse, sortBy } from "lodash";

import GetVideoInfo from "./GetVideoInfo";
import { getCookie, getLocalstorage } from "./../../util/Utils";

const filterVideos = async (response) => {
  if (response && response.items && response.items.length > 0) {
    const items = await Promise.all(
      response.items.filter((video) => {
        return video.snippet.type === "upload";
      })
    );
    return items;
  } else {
    return [];
  }
};

const fetchSubscriptionVideos = async (videosCACHE, channel) => {
  const currentDate = new Date();
  const DATE_THRESHOLD = new Date(currentDate.setDate(currentDate.getDate() - 7));

  let error = null;
  let res = null;

  const CheckForCachedChannel = () => {
    // console.log("CheckForCachedChannel -> channel", channel);
    try {
      return videosCACHE.find(
        (cacheChannel) =>
          cacheChannel.channel.snippet.resourceId.channelId === channel.snippet.resourceId.channelId
      );
    } catch (error) {
      return null;
    }
  };

  const cachedChannelObj = CheckForCachedChannel();

  // console.log("fetchSubscriptionVideos -> cachedChannelObj", cachedChannelObj);

  if (cachedChannelObj) {
    // console.log(":::video cache exists!:::");
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 10,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          "If-None-Match": cachedChannelObj.channel.etag,
          Authorization: `Bearer ${getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (e) {
        // e.response.data.error.code === 403}
        error = e;
        return cachedChannelObj;
      });
  } else {
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 7,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: `Bearer ${getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (e) {
        // e.response.data.error.code === 403
        error = e;
      });
  }

  return {
    res,
    error,
  };
};

export default async (followedChannels) => {
  const THRESHOLD_DATE = 5;
  // const videosUnordered = [];
  const DATE_THRESHOLD = new Date();
  DATE_THRESHOLD.setDate(new Date().getDate() - THRESHOLD_DATE);

  let error = null;

  try {
    const videosCACHE = getLocalstorage("YT-ChannelsObj") || [];

    const channelWithVideos = await Promise.all(
      followedChannels.map(async (channel) => {
        return await fetchSubscriptionVideos(videosCACHE, channel).then(async (result) => {
          error = result.error;
          const items = await filterVideos(result.res);

          return { channel: channel, items: items };
        });
      })
    );
    localStorage.setItem("YT-ChannelsObj", JSON.stringify(channelWithVideos));

    const videoOnlyArray = await Promise.all(
      channelWithVideos.map((channel) => (Array.isArray(channel.items) ? channel.items : null))
    );

    const flattedVideosArray = videoOnlyArray.flat(1).filter((items) => items);

    const videosWithDetails = await GetVideoInfo(flattedVideosArray);

    const sortedVideos = reverse(sortBy(videosWithDetails, (video) => video.snippet.publishedAt));

    return { data: sortedVideos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
};
