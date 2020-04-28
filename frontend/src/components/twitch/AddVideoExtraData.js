import axios from "axios";

import { getCookie, getLocalstorage } from "./../../util/Utils";
import GetCachedProfiles from "./GetCachedProfiles";

const getGameDetails = async (items) => {
  // Removes game id duplicates before sending game request.
  const games = [
    ...new Set(
      items.data.data.map((channel) => {
        return channel.game_id;
      })
    ),
  ];

  const cachedGameInfo = getLocalstorage("Twitch_game_details") || { data: [] };

  const unCachedGameDetails = games.filter((game) => {
    return !cachedGameInfo.data.find((cachedGame) => cachedGame.id === game);
  });

  if (cachedGameInfo.expire < new Date().getTime() || unCachedGameDetails.length >= 1) {
    return await axios
      .get(`https://api.twitch.tv/helix/games`, {
        params: {
          id: cachedGameInfo.expire < new Date().getTime() ? games : unCachedGameDetails,
        },
        headers: {
          Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then((res) => {
        localStorage.setItem(
          "Twitch_game_details",
          JSON.stringify({
            data: cachedGameInfo.data.concat(res.data.data),
            expire:
              cachedGameInfo.expire < new Date().getTime()
                ? new Date().setDate(new Date().getDate() + 3)
                : cachedGameInfo.expire,
          })
        );

        return cachedGameInfo.data.concat(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        return cachedGameInfo.data;
      });
  } else {
    return cachedGameInfo.data;
  }
};

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
          Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
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
    const gameNames = await getGameDetails(items);

    // Add the game name to each stream object.
    items.data.data.map((stream) => {
      gameNames.find((game) => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_name = gameNames.find((game) => {
            return game.id === stream.game_id;
          }).name)
        : (stream.game_name = "");

      return undefined;
    });

    // Add the game img to each stream object.
    items.data.data.map((stream) => {
      gameNames.find((game) => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_img = gameNames.find((game) => {
            return game.id === stream.game_id;
          }).box_art_url)
        : (stream.game_img =
            stream.game_name === "" ? "" : `${process.env.PUBLIC_URL}/images/placeholder.jpg`);

      return undefined;
    });
  }

  return items.data;
};
