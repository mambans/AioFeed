import axios from "axios";

import { getCookie } from "./../../../util/Utils";

/**
 * @param {String} channelId - Channel id of Twitch channel to fetch info from.
 * @param {Function} setChannelInfo - Set state func.
 */
export default async (channelId, setChannelInfo) => {
  return await axios
    .get(`https://api.twitch.tv/kraken/channels/${channelId}`, {
      headers: {
        Authorization: `OAuth ${getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
      },
    })
    .then((res) => {
      if (setChannelInfo) setChannelInfo(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("fetchChannelInfo: ", error);
    });
};
