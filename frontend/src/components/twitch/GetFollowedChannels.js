import axios from "axios";

import { getCookie } from "../../util/Utils";

const fetchNextPageOfFollowers = async ({
  total,
  PagePagination,
  followedchannels,
  twitchUserId,
}) => {
  if (total > followedchannels.length) {
    const nextPage = await axios
      .get(`https://api.twitch.tv/helix/users/follows?`, {
        params: {
          from_id: twitchUserId,
          first: 100,
          after: PagePagination,
        },
        headers: {
          Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch((error) => {
        console.log(error);
      });

    const channels = followedchannels.concat(nextPage.data.data);

    if (channels.length < total) {
      return await fetchNextPageOfFollowers({
        total: total,
        twitchUserId: twitchUserId,
        PagePagination: nextPage.data.pagination.cursor,
        followedchannels: channels,
      });
    }
    return channels;
  }
  return followedchannels;
};

export default async () => {
  try {
    const followedchannels = await axios
      .get(`https://api.twitch.tv/helix/users/follows?`, {
        params: {
          from_id: getCookie("Twitch-userId"),
          first: 100,
        },
        headers: {
          Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch((error) => {
        console.error(error.message);
        return error;
      });

    const channels = await fetchNextPageOfFollowers({
      total: followedchannels.data.total,
      PagePagination: followedchannels.data.pagination.cursor,
      followedchannels: followedchannels.data.data,
      twitchUserId: getCookie("Twitch-userId"),
    });

    return channels;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};
