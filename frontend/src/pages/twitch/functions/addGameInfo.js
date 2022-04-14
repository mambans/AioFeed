import { chunk } from '../../../util';
import TwitchAPI from '../API';
import getCachedGameInfo from './getCachedGameInfo';

const addGameInfo = async ({ save, refresh, items = [] } = { items: [] }) => {
  const gamesNonDuplicates = [...new Set(items.map((i) => i?.game_id))].filter((i) => i);
  const cached = getCachedGameInfo({ refresh });

  const nonCached =
    gamesNonDuplicates.filter((i) => {
      return !cached[i];
    }) || [];

  const nonCachedChunked = chunk(nonCached, 100);

  const newGameInfo = nonCached?.length
    ? await Promise.all(
        nonCachedChunked.map(async (array) => {
          return await TwitchAPI.getGames({ id: array })
            .then((res) => res?.data?.data)
            .catch(() => []);
        })
      ).then((res) => res.flat())
    : [];

  const newCache = {
    ...cached,
    ...newGameInfo.reduce((acc, i) => {
      acc[i.id] = {
        id: i.id,
        name: i.name,
        box_art_url: i.box_art_url,
      };

      return acc;
    }, {}),
    expireDate: cached?.expireDate,
  };

  if (save) localStorage.setItem('Twitch_game_details', JSON.stringify(newCache));

  const newItemsWithInfo = items.map((i) => {
    if (!i.game_img && newCache[i.game_id]) {
      i.game_img = newCache[i.game_id]?.box_art_url;
    }
    if (!i.game_name) i.game_name = newCache[i.game_id]?.name;

    return i;
  });

  return newItemsWithInfo;
};
export default addGameInfo;
