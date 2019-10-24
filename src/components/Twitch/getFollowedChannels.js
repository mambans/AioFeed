import axios from "axios";

import Utilities from "../../utilities/Utilities";

const fetchNextPageOfFollowers = async (PagePagination, followedchannels) => {
  const nextPage = await axios.get(`https://api.twitch.tv/helix/users/follows?`, {
    params: {
      from_id: 32540540,
      first: 100,
      after: PagePagination,
    },
    headers: {
      Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  });

  nextPage.data.data.forEach(channel => {
    followedchannels.data.data.push(channel);
  });

  if (followedchannels.data.data.length < followedchannels.data.total) {
    await fetchNextPageOfFollowers(nextPage.data.pagination.cursor, followedchannels);
  }
};

async function getFollowedChannels() {
  try {
    const followedchannels = await axios
      .get(`https://api.twitch.tv/helix/users/follows?`, {
        params: {
          from_id: 32540540,
          first: 100,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch(error => {
        console.error(error.message);
        return error;
      });

    await fetchNextPageOfFollowers(followedchannels.data.pagination.cursor, followedchannels);

    return followedchannels;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

export default getFollowedChannels;
