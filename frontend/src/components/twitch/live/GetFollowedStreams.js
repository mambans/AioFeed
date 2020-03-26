import axios from "axios";

import AddVideoExtraData from "./../AddVideoExtraData";
import Util from "../../../util/Util";

const fetchAllOnlineStreams = async followedChannelsIds => {
  return await axios.get(`https://api.twitch.tv/helix/streams`, {
    params: {
      user_id: followedChannelsIds,
      first: 100,
    },
    headers: {
      Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  });
};

async function getFollowedOnlineStreams(followedchannels) {
  let error;

  try {
    // Make an array of all followed channels id's for easier/less API reuqests.
    const followedChannelsIds = await followedchannels.map(channel => {
      return channel.to_id;
    });

    // Get all Live-streams from followed channels.
    const LiveFollowedStreams = await fetchAllOnlineStreams(followedChannelsIds);

    try {
      if (LiveFollowedStreams.data.data.length > 0) {
        await AddVideoExtraData(LiveFollowedStreams);
      }
    } catch (e) {
      console.error(e);
      error = e;
      return { error: error, status: 201 };
    }
    return {
      data: LiveFollowedStreams.data.data,
      status: 200,
      error: error,
    };
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

export default getFollowedOnlineStreams;
