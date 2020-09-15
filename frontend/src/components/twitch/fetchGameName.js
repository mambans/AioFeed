import { getLocalstorage } from './../../util/Utils';
import API from './API';

const getGameDetails = async (items) => {
  // Removes game id duplicates before sending game request.
  const games = [
    ...new Set(
      items.map((channel) => {
        return channel?.game_id;
      })
    ),
  ];

  const cachedGameInfo = getLocalstorage('Twitch_game_details') || { data: [] };
  const cachedFilteredGames = cachedGameInfo.data.filter((game) => game);
  const unCachedGameDetails = games.filter((game) => {
    return !cachedFilteredGames?.find((cachedGame) => cachedGame.id === game);
  });

  const GamesToFetch = cachedGameInfo?.expire < Date.now() ? games : unCachedGameDetails;

  if (GamesToFetch?.length >= 1) {
    return API.getGames({
      params: {
        id: GamesToFetch,
      },
    })
      .then((res) => {
        const filteredOutNulls = res.data?.data.filter((game) => game);
        localStorage.setItem(
          'Twitch_game_details',
          JSON.stringify({
            data: [...cachedFilteredGames, ...filteredOutNulls],
            expire:
              cachedGameInfo?.expire < Date.now()
                ? Date.now() + 7 * 24 * 60 * 60 * 1000
                : cachedGameInfo.expire,
          })
        );
        return [...cachedFilteredGames, ...filteredOutNulls];
      })
      .catch((error) => {
        console.log(error);
        return cachedFilteredGames;
      });
  }
  return cachedFilteredGames;
};

/**
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data[] )
 * @async
 * @returns
 */
export default async ({ items }) => {
  const originalArray = items;

  const gameNames = await getGameDetails(originalArray.data);

  const objWithGameName = await originalArray.data.map((stream) => {
    const foundGame = gameNames.find((game) => {
      return game?.id === stream?.game_id;
    });
    stream.game_name = foundGame ? foundGame.name : '';
    return stream;
  });

  const finallObj = await objWithGameName.map((stream) => {
    const foundGame = gameNames.find((game) => {
      return game?.id === stream?.game_id;
    });
    stream.game_img = foundGame
      ? foundGame.box_art_url
      : stream.game_name === ''
      ? ''
      : `${process.env.PUBLIC_URL}/images/placeholder.webp`;

    return stream;
  });

  return finallObj;
};
