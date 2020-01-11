import axios from "axios";
import _ from "lodash";

import getFollowedChannels from "./../GetFollowedChannels";
import Utilities from "../../../utilities/Utilities";

const getMonitoredVodChannels = async () => {
  const vodChannels = await axios
    .get(`http://localhost:3100/notifies/vod-channels`)
    .then(channels => {
      return channels.data.channels.map(channel => {
        return channel.name;
      });
    })
    .catch(error => {
      console.log({ error });
      return error;
    });

  return vodChannels;
};

const monitoredChannelNameToId = async (followedChannels, FollowedChannelVods) => {
  const vodChannelsWithoutFollow = [];
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
    });

  // const vodChannels = followedChannels.data.data
  //   .map(channel => {
  //     if (FollowedChannelVods.includes(channel.to_name.toLowerCase())) {
  //       return channel.to_id;
  //     }
  //     // else {
  //     //   // vodChannelsWithoutFollow.push(channel.to_name);
  //     //   return null;
  //     // }
  //     return null;
  //   })
  //   .filter(channel => {
  //     return channel !== null;
  //   });

  return vodChannels;
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

async function getFollowedVods(forceRun) {
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
        const followedChannels = await getFollowedChannels();

        const FollowedChannelVods = await getMonitoredVodChannels();

        const vodChannels = await monitoredChannelNameToId(followedChannels, FollowedChannelVods);

        const followedStreamVods = await fetchVodsFromMonitoredChannels(vodChannels);

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
