import { getLocalstorage } from '../../../util';
import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';
import { addVodEndTime } from '../TwitchUtils';
import getMyFollowedChannels from './../getMyFollowedChannels';
import reauthenticate from './../reauthenticate';
import SortAndAddExpire from './SortAndAddExpire';

const monitoredChannelNameToId = async (followedChannels, followedVodEnabledChannels) => {
  const vodChannelsWithoutFollow = [];
  let error;
  const vodChannelIds = await followedVodEnabledChannels
    .map((vodChannel) => {
      const channelFollowed = followedChannels?.find(
        (channel) => channel.to_name?.toLowerCase() === vodChannel
      );

      if (channelFollowed) return channelFollowed.to_id;

      vodChannelsWithoutFollow.push(vodChannel);
      return null;
    })
    .filter((channel) => channel);

  const vodChannelsIdsWithoutLiveFollow = Boolean(vodChannelsWithoutFollow.length)
    ? await TwitchAPI.getUser({
        login: vodChannelsWithoutFollow,
        first: 100,
      })
        .then((res) => res.data.data.map((channel) => channel.id))
        .catch((err) => {
          console.error(err);
          error = err;
        })
    : [];

  return { data: [...vodChannelIds, ...vodChannelsIdsWithoutLiveFollow], error: error };
};

const fetchVodsFromMonitoredChannels = async (
  vodChannels,
  setTwitchAccessToken,
  setRefreshToken
) => {
  let followedStreamVods = [];

  const PromiseAllVods = await Promise.all(
    vodChannels.map(
      async (channelId) =>
        await TwitchAPI.getVideos({
          user_id: channelId,
          period: 'month',
          first: 5,
          type: 'all',
        }).then((response) => response.data.data)
    )
  ).catch(async () => {
    return await reauthenticate({ setTwitchToken: setTwitchAccessToken, setRefreshToken }).then(
      async (access_token) => {
        const channelFetchedVods = [...new Set(followedStreamVods.map((vod) => vod.user_id))];

        const channelsIdsUnfetchedVods = await vodChannels.filter(
          (channel) => !channelFetchedVods?.includes(channel)
        );

        return await Promise.all(
          channelsIdsUnfetchedVods.map(
            async (channel) =>
              await TwitchAPI.getVideos({
                user_id: channel,
                period: 'month',
                first: 5,
                type: 'all',
              }).then((response) => response.data.data)
          )
        );
      }
    );
  });

  return PromiseAllVods.flat(1);
};

const getFollowedVods = async ({ forceRun, setRefreshToken, setTwitchAccessToken, channels }) => {
  const vodExpire = 3; // Number of hours
  const cachedVods = getLocalstorage(`Vods`);

  try {
    if (forceRun || !cachedVods || cachedVods.expire <= Date.now()) {
      try {
        const followedChannels = await getMyFollowedChannels();

        const followedVodEnabledChannels = channels;
        if (!followedVodEnabledChannels || !Boolean(followedVodEnabledChannels.length)) {
          return {
            error: {
              data: {
                title: 'No monitored vod channels.',
                message: 'You have not added any Twitch channels to fetch vods from yet.',
              },
            },
          };
        }

        const vodChannels = await monitoredChannelNameToId(
          followedChannels,
          followedVodEnabledChannels
        );

        const followedStreamVods = await fetchVodsFromMonitoredChannels(
          vodChannels.data,
          setTwitchAccessToken,
          setRefreshToken
        );

        const videos = await AddVideoExtraData({
          items: {
            data: followedStreamVods,
          },
        });

        const videoWithEndTime = await addVodEndTime(videos.data);

        const followedOrderedStreamVods = SortAndAddExpire(videoWithEndTime, vodExpire);

        return {
          videos: followedOrderedStreamVods || [],
          vodError: vodChannels.error,
        };
      } catch (error) {
        return {
          videos: cachedVods,
          error: error,
        };
      }
    }

    return { videos: cachedVods };
  } catch (error) {
    console.error('message: ', error.message);
    return {
      videos: cachedVods,
      error: error,
    };
  }
};
export default getFollowedVods;
