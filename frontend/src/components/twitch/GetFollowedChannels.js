import { getCookie } from '../../util/Utils';
import API from './API';
import validateToken from './validateToken';

const fetchNextPageOfFollowers = async ({
  total,
  PagePagination,
  followedchannels,
  twitchUserId,
}) => {
  if (followedchannels.length < total && PagePagination) {
    const nextPage = await API.getFollowedChannels({
      params: {
        from_id: twitchUserId,
        first: 100,
        after: PagePagination,
      },
    }).catch((error) => {
      console.log(error);
    });

    const channels = [...followedchannels, ...nextPage.data.data];

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

export default async (forceRun = false) => {
  try {
    const followedchannels = await validateToken(forceRun).then(async () => {
      return await API.getFollowedChannels({
        params: {
          from_id: getCookie('Twitch-userId'),
          first: 100,
        },
      }).catch((error) => {
        console.error(error.message);
        return error;
      });
    });

    const channels = await fetchNextPageOfFollowers({
      total: followedchannels?.data?.total,
      PagePagination: followedchannels?.data?.pagination.cursor,
      followedchannels: followedchannels?.data?.data,
      twitchUserId: getCookie('Twitch-userId'),
    });

    return channels;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};
