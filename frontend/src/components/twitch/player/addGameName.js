import TwitchAPI from '../API';
import { getLocalstorage } from '../../../util/Utils';

const addGameName = async ({ streamInfo, newStreamInfo }) => {
  try {
    if (!streamInfo || streamInfo?.game_id !== newStreamInfo) {
      const cachedGameInfo =
        getLocalstorage('Twitch_game_details')?.exire > Date.now()
          ? getLocalstorage('Twitch_game_details')
          : { data: [], expire: Date.now() + 7 * 24 * 60 * 60 * 1000 };
      const foundCachedGame = cachedGameInfo.data.find(
        (game) => game?.id === newStreamInfo?.game_id
      );

      const gameInfo =
        foundCachedGame ||
        (newStreamInfo?.game_id &&
          (await TwitchAPI.getGames({
            id: newStreamInfo?.game_id,
          }).then((res) => res.data.data[0])));

      if (!foundCachedGame && gameInfo) {
        try {
          localStorage.setItem(
            'Twitch_game_details',
            JSON.stringify({
              data: [...cachedGameInfo.data, gameInfo],
              expire: cachedGameInfo.expire,
            })
          );
        } catch (error) {
          console.log('Twitch_game_details localstorage setItem error:', error);
        }
      }

      return { ...newStreamInfo, game_name: gameInfo?.name };
    }
    return newStreamInfo;
  } catch (error) {
    console.log('error', error);
  }
};
export default addGameName;
