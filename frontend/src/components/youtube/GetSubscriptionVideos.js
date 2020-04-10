import axios from "axios";
import { reverse, sortBy } from "lodash";

import getVideoInfo from "./GetVideoInfo";
import Util from "./../../util/Util";

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

const fetchSubscriptionData = async (videosCACHE, channel) => {
  const currentDate = new Date();
  const DATE_THRESHOLD = new Date(currentDate.setDate(currentDate.getDate() - 5));

  let error = null;
  let res = null;

  if (videosCACHE[channel.snippet.resourceId.channelId]) {
    console.log(":::video cache exists!:::");
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 5,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          "If-None-Match": videosCACHE[channel.snippet.resourceId.channelId].etag,
          Authorization: `Bearer ${Util.getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (e) {
        error = e;
        return videosCACHE[channel.snippet.resourceId.channelId];
      });
  } else {
    console.log("---Video request sent!---");
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 5,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: `Bearer ${Util.getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (e) {
        error = e;
      });
  }

  return { res, error };
};

async function getSubscriptionVideos(followedChannels) {
  const THRESHOLD_DATE = 5;
  // const videosUnordered = [];
  const DATE_THRESHOLD = new Date();
  DATE_THRESHOLD.setDate(new Date().getDate() - THRESHOLD_DATE);

  let error = null;

  try {
    const videosCACHE =
      localStorage.getItem("YoutubeVideos") !== "undefined" &&
      localStorage.getItem("YoutubeVideos") !== undefined &&
      localStorage.getItem("YoutubeVideos") !== "null" &&
      localStorage.getItem("YoutubeVideos") !== null
        ? JSON.parse(localStorage.getItem("YoutubeVideos"))
        : {};

    const videos = {};

    await Promise.all(
      followedChannels.map(async (channel) => {
        const response = await fetchSubscriptionData(videosCACHE, channel);

        response.res.items = await filterVideos(response.res);
        error = response.error;

        videos[channel.snippet.resourceId.channelId] = response.res;
      })
    );

    const videosWithDetails = await getVideoInfo(videos);

    localStorage.setItem("YoutubeVideos", JSON.stringify(videosWithDetails));

    let videosUnorderedNew = [];

    await Promise.all(
      Object.values(videos).map(async (channel, index) => {
        await channel.items.map((video) => {
          videosUnorderedNew.push(video);
          return video;
        });
      })
    );

    const allVideos = reverse(sortBy(videosUnorderedNew, (video) => video.snippet.publishedAt));

    return { data: allVideos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getSubscriptionVideos;
