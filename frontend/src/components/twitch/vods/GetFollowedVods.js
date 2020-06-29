import { durationToDate } from './../TwitchUtils';
import { getLocalstorage } from '../../../util/Utils';
import AddVideoExtraData from '../AddVideoExtraData';
import API from '../API';
import FetchMonitoredVodChannelsList from './FetchMonitoredVodChannelsList';
import GetFollowedChannels from './../GetFollowedChannels';
import reauthenticate from './../reauthenticate';
import SortAndAddExpire from './SortAndAddExpire';

const monitoredChannelNameToId = async (followedChannels, FollowedChannelVods) => {
  const vodChannelsWithoutFollow = [];
  let error;
  const vodChannels = await FollowedChannelVods.map((vod) => {
    const channelFollowed = followedChannels.find(
      (channel) => channel.to_name.toLowerCase() === vod
    );
    if (channelFollowed) {
      return channelFollowed.to_id;
    } else {
      vodChannelsWithoutFollow.push(vod);
      return null;
    }
  }).filter((channel) => {
    return channel !== null;
  });

  if (vodChannelsWithoutFollow.length > 0) {
    await API.getUser({
      params: {
        login: vodChannelsWithoutFollow,
        first: 100,
      },
    })
      .then((res) => {
        res.data.data.map((channel) => {
          vodChannels.push(channel.id);
          return null;
        });
      })
      .catch((err) => {
        console.error(err);
        error = err;
      });
  }

  return { data: vodChannels, error: error };
};

const addVodEndTime = async (followedStreamVods) => {
  followedStreamVods.map((stream) => {
    if (stream.type === 'archive') {
      stream.endDate = durationToDate(stream.duration, stream.created_at);
    } else {
      stream.endDate = new Date(stream.created_at).getTime();
    }
    return '';
  });
};

const fetchVodsFromMonitoredChannels = async (vodChannels, setTwitchToken, setRefreshToken) => {
  let followedStreamVods = [];

  const PromiseAllVods = await Promise.all(
    vodChannels.map(async (channel) => {
      followedStreamVods = await API.getVideos({
        params: {
          user_id: channel,
          period: 'month',
          first: 5,
          // type: "archive",
          type: 'all',
        },
      }).then((response) => {
        return response.data.data;
      });

      return followedStreamVods;
    })
  ).catch(async () => {
    return await reauthenticate(setTwitchToken, setRefreshToken).then(async (access_token) => {
      const channelFetchedVods = [
        ...new Set(
          followedStreamVods.map((vod) => {
            return vod.user_id;
          })
        ),
      ];

      const channelsIdsUnfetchedVods = await vodChannels.filter((channel) => {
        return !channelFetchedVods.includes(channel);
      });

      return await Promise.all(
        channelsIdsUnfetchedVods.map(async (channel) => {
          return await API.getVideos({
            params: {
              user_id: channel,
              period: 'month',
              first: 5,
              // type: "archive",
              type: 'all',
            },
          }).then((response) => {
            return response.data.data;
          });
        })
      );
    });
  });

  const AllVods = PromiseAllVods.flat(1);

  return AllVods;
};

export default async (forceRun, AuthKey, Username, setRefreshToken, setTwitchToken) => {
  const vodExpire = 3; // Number of hours

  try {
    if (forceRun || !getLocalstorage(`Vods`) || getLocalstorage(`Vods`).expire <= Date.now()) {
      try {
        const followedChannels = await GetFollowedChannels(true);

        const followedVodEnabledChannels = await FetchMonitoredVodChannelsList(Username, AuthKey);
        if (!followedVodEnabledChannels || followedVodEnabledChannels.length === 0) {
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
          setTwitchToken,
          setRefreshToken
        );

        const videos = await AddVideoExtraData({
          items: {
            data: followedStreamVods,
          },
        });

        await addVodEndTime(videos.data);

        const followedOrderedStreamVods = SortAndAddExpire(videos.data, vodExpire);

        localStorage.setItem(`Vods`, JSON.stringify(followedOrderedStreamVods));
        return {
          data: followedOrderedStreamVods,
          vodError: vodChannels.error,
        };
      } catch (error) {
        return {
          data: getLocalstorage('Vods'),
          error: error,
        };
      }
    }

    return { data: getLocalstorage('Vods') };
  } catch (error) {
    console.error('message: ', error.message);
    return {
      data: getLocalstorage('Vods'),
      error: error,
    };
  }
};
