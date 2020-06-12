import { getLocalstorage } from "./../../util/Utils";
import GetCachedProfiles from "./GetCachedProfiles";
import API from "./API";

const getGameDetails = async (items) => {
  // Removes game id duplicates before sending game request.
  const games = [
    ...new Set(
      items.map((channel) => {
        return channel && channel.game_id;
      })
    ),
  ];

  const cachedGameInfo = getLocalstorage("Twitch_game_details") || { data: [] };
  const cachedFilteredGames = cachedGameInfo.data.filter((game) => game);
  const unCachedGameDetails = games.filter((game) => {
    return !cachedFilteredGames.find((cachedGame) => cachedGame.id === game);
  });

  const GamesToFetch =
    cachedGameInfo.expire && cachedGameInfo.expire < Date.now() ? games : unCachedGameDetails;

  if (GamesToFetch && Array.isArray(GamesToFetch) && GamesToFetch.length >= 1) {
    return API.getGames({
      params: {
        id: GamesToFetch,
      },
    })
      .then((res) => {
        const filteredOutNulls = res.data.data.filter((game) => game);
        localStorage.setItem(
          "Twitch_game_details",
          JSON.stringify({
            data: cachedFilteredGames.concat(filteredOutNulls),
            expire:
              cachedGameInfo.expire < Date.now()
                ? Date.now() + 7 * 24 * 60 * 60 * 1000
                : cachedGameInfo.expire,
          })
        );
        return cachedFilteredGames.concat(filteredOutNulls);
      })
      .catch((error) => {
        console.log(error);
        return cachedFilteredGames;
      });
  } else {
    return cachedFilteredGames;
  }
};

/**
 * Fetch and add following data to stream objects.
 * - profile_img_url
 * - game name
 * - game_img
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data[] )
 * @param {Boolean} [fetchGameInfo=true] - If it should fetch/add game info
 * @async
 * @returns
 */
export default async ({ items, fetchGameInfo = true, forceNewProfiles = false }) => {
  const originalArray = items;
  const TwitchProfiles = GetCachedProfiles(forceNewProfiles);
  const noCachedProfileArrayObject = await originalArray.data.filter((user) => {
    return !Object.keys(TwitchProfiles).some((id) => id === (user.user_id || user.broadcaster_id));
  });

  const noCachedProfileArrayIds = Object.values(
    forceNewProfiles ? originalArray.data : noCachedProfileArrayObject
  ).map((user) => {
    return user.user_id || user.broadcaster_id;
  });

  let newProfileImgUrls;

  if (noCachedProfileArrayIds.length > 0) {
    newProfileImgUrls = await API.getUser({
      params: {
        id: noCachedProfileArrayIds,
      },
    }).catch((e) => {
      console.log("newProfileImgUrls: ", e);
    });
  }

  const finallData = await Promise.all(
    await originalArray.data.map(async (user) => {
      if (forceNewProfiles || !TwitchProfiles[user.user_id || user.broadcaster_id]) {
        const foundProfile = newProfileImgUrls.data.data.find((p_user) => {
          return p_user.id === (user.user_id || user.broadcaster_id);
        });
        user.profile_img_url = foundProfile
          ? foundProfile.profile_image_url
          : TwitchProfiles[user.user_id || user.broadcaster_id] || "";
      } else {
        user.profile_img_url = TwitchProfiles[user.user_id || user.broadcaster_id];
      }
      return user;
    })
  ).then(async (res) => {
    const newProfiles = res.reduce(
      // eslint-disable-next-line no-sequences
      (obj, item) => ((obj[item.user_id || item.broadcaster_id] = item.profile_img_url), obj),
      {}
    );
    const FinallTwitchProfilesObj = { ...newProfiles, ...TwitchProfiles };
    localStorage.setItem("TwitchProfiles", JSON.stringify(FinallTwitchProfilesObj));

    if (fetchGameInfo) {
      const gameNames = await getGameDetails(originalArray.data);

      const objWithGameDetails = await new Promise(async (resolve, reject) => {
        // Add the game name to each stream object.
        const objWithGameName = res.map((stream) => {
          const foundGame = gameNames.find((game) => {
            return game.id === stream.game_id;
          });
          stream.game_name = foundGame ? foundGame.name : "";
          return stream;
        });

        resolve(objWithGameName);
      }).then(async (res) => {
        // Add the game img to each stream object.
        const finallObj = await res.map((stream) => {
          const foundGame = gameNames.find((game) => {
            return game.id === stream.game_id;
          });
          stream.game_img = foundGame
            ? foundGame.box_art_url
            : stream.game_name === ""
            ? ""
            : `${process.env.PUBLIC_URL}/images/placeholder.webp`;

          return stream;
        });
        return finallObj;
      });
      return objWithGameDetails;
    }
    return res;
  });
  return { ...originalArray, data: finallData };
};
