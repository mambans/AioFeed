/* eslint-disable no-unused-vars */
import axios from "axios";
import { getCookie } from "./../../../util/Utils";

/* eslint-enable no-unused-vars */

export default async ({ subscriptionId, channelId, setChannels, videos, setVideos }) => {
  const followedChannels = JSON.parse(localStorage.getItem(`YT-followedChannels`)) || [];
  const newFollowedChannels = followedChannels.data.filter(function (channel) {
    return channel.id !== subscriptionId;
  });
  const newFilteredVideos = videos.filter((video) => {
    return video.snippet.channelId !== channelId;
  });

  setChannels(newFollowedChannels);
  setVideos(newFilteredVideos);

  localStorage.setItem(
    `YT-followedChannels`,
    JSON.stringify({
      data: newFollowedChannels,
      casheExpire: followedChannels.casheExpire,
    })
  );

  await axios.delete(`https://www.googleapis.com/youtube/v3/subscriptions`, {
    params: {
      id: subscriptionId,
      key: process.env.REACT_APP_YOUTUBE_API_KEY,
    },
    headers: {
      Authorization: "Bearer " + getCookie("Youtube-access_token"),
      Accept: "application/json",
    },
  });
};
