import axios from "axios";

import Util from "./../../util/Util";
import GetCachedProfiles from "./GetCachedProfiles";

/**
 * Fetch and add following data to stream objects.
 * - profile_img_url
 * - game name
 * - game_img
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data.data[] )
 * @param {Boolean} [fetchGameInfo=true] - If it should fetch/add game info
 * @async
 * @returns
 */
export default async (items, fetchGameInfo = true) => {
  const TwitchProfiles = GetCachedProfiles();

  const noCachedProfileArrayObject = await items.data.data.filter((user) => {
    return !Object.keys(TwitchProfiles).some((id) => id === (user.user_id || user.broadcaster_id));
  });

  const noCachedProfileArrayIds = Object.values(noCachedProfileArrayObject).map((user) => {
    return user.user_id || user.broadcaster_id;
  });

  let newProfileImgUrls;

  if (noCachedProfileArrayIds.length > 0) {
    newProfileImgUrls = await axios
      .get(`https://api.twitch.tv/helix/users?`, {
        params: {
          id: noCachedProfileArrayIds,
        },
        headers: {
          Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch((e) => {
        console.log("newProfileImgUrls: ", e);
      });
  }

  Promise.all(
    await items.data.data.map(async (user) => {
      if (!TwitchProfiles[user.user_id || user.broadcaster_id]) {
        user.profile_img_url = newProfileImgUrls.data.data.find((p_user) => {
          return p_user.id === (user.user_id || user.broadcaster_id);
        }).profile_image_url;
      } else {
        user.profile_img_url = TwitchProfiles[user.user_id || user.broadcaster_id];
      }
      return user;
    })
  ).then((res) => {
    const newProfiles = res.reduce(
      // eslint-disable-next-line no-sequences
      (obj, item) => ((obj[item.user_id || item.broadcaster_id] = item.profile_img_url), obj),
      {}
    );

    const FinallTwitchProfilesObj = { ...newProfiles, ...TwitchProfiles };

    localStorage.setItem("TwitchProfiles", JSON.stringify(FinallTwitchProfilesObj));
  });

  if (fetchGameInfo) {
    // Removes game id duplicates before sending game request.
    const games = [
      ...new Set(
        items.data.data.map((channel) => {
          return channel.game_id;
        })
      ),
    ];

    const gameNames = await axios.get(`https://api.twitch.tv/helix/games`, {
      params: {
        id: games,
      },
      headers: {
        Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    });

    // Add the game name to each stream object.
    items.data.data.map((stream) => {
      gameNames.data.data.find((game) => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_name = gameNames.data.data.find((game) => {
            return game.id === stream.game_id;
          }).name)
        : (stream.game_name = "");

      return undefined;
    });

    // Add the game img to each stream object.
    items.data.data.map((stream) => {
      gameNames.data.data.find((game) => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_img = gameNames.data.data.find((game) => {
            return game.id === stream.game_id;
          }).box_art_url)
        : (stream.game_img =
            stream.game_name !== "" && `${process.env.PUBLIC_URL}/images/placeholder.jpg`);

      return undefined;
    });
  }

  return items.data;
};
