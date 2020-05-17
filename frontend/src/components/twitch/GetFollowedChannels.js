import { getCookie } from "../../util/Utils";
import validateToken from "./validateToken";
import API from "./API";

const fetchNextPageOfFollowers = async ({
  total,
  PagePagination,
  followedchannels,
  twitchUserId,
}) => {
  if (total > followedchannels.length) {
    const nextPage = await API.getFollowedChannels({
      params: {
        from_id: twitchUserId,
        first: 100,
        after: PagePagination,
      },
    }).catch((error) => {
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
    const followedchannels = await validateToken().then(async () => {
      return await API.getFollowedChannels({
        params: {
          from_id: getCookie("Twitch-userId"),
          first: 100,
        },
      }).catch((error) => {
        console.error(error.message);
        return error;
      });
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
