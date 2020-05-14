import axios from "axios";

import GetFollowedChannels from "./../GetFollowedChannels";
import { durationToDate } from "./../TwitchUtils";
import { getCookie, getLocalstorage } from "../../../util/Utils";
import reauthenticate from "./../reauthenticate";
import AddVideoExtraData from "../AddVideoExtraData";
import FetchMonitoredVodChannelsList from "./FetchMonitoredVodChannelsList";
import SortAndAddExpire from "./SortAndAddExpire";

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
    await axios
      .get(`https://api.twitch.tv/helix/users`, {
        params: {
          login: vodChannelsWithoutFollow,
          first: 100,
        },
        headers: {
          Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
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
    if (stream.type === "archive") {
      stream.endDate = durationToDate(stream.duration, stream.created_at);
    } else {
      stream.endDate = new Date(stream.created_at).getTime();
    }
    return "";
  });
};

const axiosConfig = (method, channel, access_token = getCookie("Twitch-access_token")) => {
  return {
    method: method,
    url: `https://api.twitch.tv/helix/videos?`,
    params: {
      user_id: channel,
      period: "month",
      first: 5,
      // type: "archive",
      type: "all",
    },
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  };
};

const fetchVodsFromMonitoredChannels = async (vodChannels, setTwitchToken, setRefreshToken) => {
  let followedStreamVods = [];

  const PromiseAllVods = await Promise.all(
    vodChannels.map(async (channel) => {
      followedStreamVods = await axios(axiosConfig("get", channel)).then((response) => {
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
          return await axios(axiosConfig("get", channel, access_token)).then((response) => {
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
    if (!getLocalstorage(`Vods`) || getLocalstorage(`Vods`).expire <= Date.now() || forceRun) {
      try {
        const followedChannels = await GetFollowedChannels();

        const FollowedChannelVods = await FetchMonitoredVodChannelsList(Username, AuthKey);
        if (FollowedChannelVods.length === 0) {
          return {
            error: {
              data: {
                title: "No monitored vod channels.",
                message: "You have not added any Twitch channels to fetch vods from yet.",
              },
            },
          };
        }

        const vodChannels = await monitoredChannelNameToId(followedChannels, FollowedChannelVods);

        const followedStreamVods = await fetchVodsFromMonitoredChannels(
          vodChannels.data,
          setTwitchToken,
          setRefreshToken
        );

        const videos = await AddVideoExtraData({
          data: {
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
          data: getLocalstorage("Vods"),
          error: error,
        };
      }
    }

    return { data: getLocalstorage("Vods") };
  } catch (error) {
    console.error("message: ", error.message);
    return {
      data: getLocalstorage("Vods"),
      error: error,
    };
  }
};
