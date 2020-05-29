import API from "../API";
import validateToken from "../validateToken";

/**
 * @param {String} channelId - Channel id of Twitch channel to fetch info from.
 * @param {Boolean} format - format data to match API.getStreams() output.
 */
export default async (channelId, format) => {
  return await validateToken().then(async () => {
    return await API.krakenGetChannelInfo({ params: { id: channelId } })
      .then((res) => {
        if (format) {
          const data = {
            ...res.data,
            profile_img_url: res.data.logo,
            user_name: res.data.display_name,
            title: res.data.status,
            user_id: res.data._id,
            viewer_count: res.data.views,
            game_name: res.data.game,
          };
          return data;
        }
        return res.data;
      })
      .catch((error) => {
        console.error("fetchChannelInfo: ", error);
      });
  });
};
