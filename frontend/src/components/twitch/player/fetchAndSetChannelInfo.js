import axios from "axios";

/**
 * @param {String} channelId - Channel id of Twitch channel to fetch info from.
 * @param {Function} setChannelInfo - Set state func.
 * @param {String} twitchToken - Twitch access token
 */
export default async (channelId, setChannelInfo, twitchToken) => {
  await axios
    .get(`https://api.twitch.tv/kraken/channels/${channelId}`, {
      headers: {
        Authorization: `OAuth ${twitchToken}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
      },
    })
    .then(res => {
      setChannelInfo(res.data);
    })
    .catch(error => {
      console.error("fetchChannelInfo: ", error);
    });
};
