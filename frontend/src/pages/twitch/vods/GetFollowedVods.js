import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';
import { addVodEndTime } from '../TwitchUtils';
import reauthenticate from './../reauthenticate';
import SortAndAddExpire from './SortAndAddExpire';

// maybe delete monitoredChannelNameToId
// eslint-disable-next-line no-unused-vars
export const monitoredChannelNameToId = async (followedChannels, followedVodEnabledChannels) => {
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

const getFollowedVods = async ({
  forceRun,
  setRefreshToken,
  setTwitchAccessToken,
  channels,
  currentVods,
}) => {
  const vodExpire = 3; // Number of hours
  // const cachedVods = getLocalstorage(`Vods`);
  const cachedVods = currentVods;

  try {
    if (
      forceRun ||
      !cachedVods ||
      !cachedVods.data ||
      !Object.values(cachedVods.data).length ||
      cachedVods.expire <= Date.now()
    ) {
      try {
        const vodChannels = channels;
        if (!vodChannels || !Boolean(vodChannels.length)) {
          return {
            error: {
              data: {
                title: 'No monitored vod channels.',
                message: 'You have not added any Twitch channels to fetch vods from yet.',
              },
            },
          };
        }

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
          data: followedOrderedStreamVods || [],
          vodError: vodChannels.error,
        };
      } catch (er) {
        return {
          data: cachedVods,
          er,
        };
      }
    }

    return { data: cachedVods };
  } catch (er) {
    console.error('message: ', er.message);
    return {
      data: cachedVods,
      er,
    };
  }
};
export default getFollowedVods;
