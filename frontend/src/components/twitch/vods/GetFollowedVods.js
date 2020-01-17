import axios from "axios";
import _ from "lodash";

import getFollowedChannels from "./../GetFollowedChannels";
import Utilities from "../../../utilities/Utilities";

const getMonitoredVodChannels = async (AuthKey, Username) => {
  const vodChannels = await axios
    .get(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/fetch`, {
      params: {
        username: Username,
        authkey: AuthKey,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.error(err);
    });

  return vodChannels;
};

const monitoredChannelNameToId = async (followedChannels, FollowedChannelVods) => {
  const vodChannelsWithoutFollow = [];
  let error;
  const vodChannels = await FollowedChannelVods.map(vod => {
    const channelFollowed = followedChannels.data.data.find(
      channel => channel.to_name.toLowerCase() === vod
    );
    if (channelFollowed) {
      return channelFollowed.to_id;
    } else {
      vodChannelsWithoutFollow.push(vod);
      return null;
    }
  }).filter(channel => {
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
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        res.data.data.map(channel => {
          vodChannels.push(channel.id);
          return null;
        });
      })
      .catch(err => {
        console.error(err);
        error = err;
      });
  }

  return { data: vodChannels, error: error };
};

const addVodEndTime = async followedStreamVods => {
  followedStreamVods.map(stream => {
    if (stream.type === "archive") {
      stream.endDate = Utilities.durationToMs(stream.duration, stream.published_at);
    } else {
      stream.endDate = new Date(stream.published_at);
    }
    return "";
  });
};

const SortAndAddExpire = async (followedStreamVods, vodExpire) => {
  let followedOrderedStreamVods = {};
  followedOrderedStreamVods.data = _.reverse(
    _.sortBy(followedStreamVods, stream => stream.endDate.getTime())
  );
  followedOrderedStreamVods.expire = new Date().setHours(new Date().getHours() + vodExpire);
  followedOrderedStreamVods.loaded = new Date();

  return followedOrderedStreamVods;
};

const fetchVodsFromMonitoredChannels = async vodChannels => {
  const followedStreamVods = [];

  await Promise.all(
    vodChannels.map(async channel => {
      const response = await axios.get(`https://api.twitch.tv/helix/videos?`, {
        params: {
          user_id: channel,
          period: "month",
          first: 10,
          // type: "archive",
          type: "all",
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      });

      response.data.data.forEach(vod => {
        followedStreamVods.push(vod);
      });
    })
  );

  return followedStreamVods;
};

async function getFollowedVods(forceRun, AuthKey, Username, twitchUserId) {
  const thresholdDate = 1;
  const vodExpire = 3;

  try {
    const today = new Date();
    const OnlyVodsAfterDate = new Date();
    OnlyVodsAfterDate.setDate(today.getDate() - thresholdDate);

    if (
      !localStorage.getItem(`Twitch-vods`) ||
      JSON.parse(localStorage.getItem("Twitch-vods")).expire <= new Date() ||
      forceRun
    ) {
      try {
        const followedChannels = await getFollowedChannels(twitchUserId);

        const FollowedChannelVods = await getMonitoredVodChannels(AuthKey, Username);

        const vodChannels = await monitoredChannelNameToId(followedChannels, FollowedChannelVods);

        const followedStreamVods = await fetchVodsFromMonitoredChannels(vodChannels.data);

        await addVodEndTime(followedStreamVods);

        const followedOrderedStreamVods = await SortAndAddExpire(followedStreamVods, vodExpire);

        localStorage.setItem(
          `Twitch-vods`,
          JSON.stringify({
            data: followedOrderedStreamVods.data,
            expire: followedOrderedStreamVods.expire,
            loaded: followedOrderedStreamVods.loaded,
          })
        );

        return {
          data: {
            data: followedOrderedStreamVods.data,
            expire: followedOrderedStreamVods.expire,
            loaded: followedOrderedStreamVods.loaded,
          },
          vodError: vodChannels.error,
        };
      } catch (error) {
        console.error(error);
        return {
          data: JSON.parse(localStorage.getItem("Twitch-vods")),
          error: error,
        };
      }
    }
    return { data: JSON.parse(localStorage.getItem("Twitch-vods")) };
  } catch (error) {
    console.error("message: ", error.message);
    return {
      data: JSON.parse(localStorage.getItem("Twitch-vods")),
      error: error,
    };
  }
}

export default getFollowedVods;
