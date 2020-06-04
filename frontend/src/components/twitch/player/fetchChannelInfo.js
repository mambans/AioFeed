import API from "../API";
import validateToken from "../validateToken";
import { getLocalstorage } from "../../../util/Utils";

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
            game_name: res.data.game,
            started_at: Date.now() - 1000,
            viewers: 0,
            game_img: getLocalstorage("Twitch_game_details")
              ? getLocalstorage("Twitch_game_details").data.find(
                  (game) => game.name.toLowerCase() === res.data.game.toLowerCase()
                ).box_art_url
              : null,
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