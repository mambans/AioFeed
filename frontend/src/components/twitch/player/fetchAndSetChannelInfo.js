import API from "../API";

/**
 * @param {String} channelId - Channel id of Twitch channel to fetch info from.
 * @param {Function} setChannelInfo - Set state func.
 */
export default async (channelId, setChannelInfo) => {
  return await API.krakenGetChannelInfo({ params: { id: channelId } })
    .then((res) => {
      if (setChannelInfo) setChannelInfo(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error("fetchChannelInfo: ", error);
    });
};
