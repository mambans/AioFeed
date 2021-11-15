import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';

/**
 * Fetch Clips
 * @param {string} category - category to fetch clips from
 * @param {Number} sortByTime - Days behind today to start fetch clips from.
 * @param {object} [page] - Pagination cursor for next page.
 * @returns {Object} {topData , error}
 * @async
 */
const getTopClips = async (category, sortByTime, page, feedVideoSizeProps) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((window.innerWidth - 150) / (feedVideoSizeProps?.totalWidth || 350)) *
    Math.floor((window.innerHeight - 150) / (feedVideoSizeProps?.height || 340));

  if (category && category !== 'undefined') {
    game = await TwitchAPI.getGames({
      name: category,
    }).then((res) => res.data.data[0]);
  } else {
    game = { id: null };
  }
  try {
    const topClips = await TwitchAPI.getClips({
      first: nrStreams,
      game_id: game?.id,
      after: page ? page.pagination.cursor : null,
      started_at: sortByTime
        ? new Date(new Date().setDate(new Date().getDate() - sortByTime)).toISOString()
        : null,
      ended_at: sortByTime && new Date().toISOString(),
    }).catch((e) => {
      console.error(e.message);
      error = e;
      return e;
    });

    const finallClips = await AddVideoExtraData({ items: topClips.data, saveNewProfiles: false });

    return { topData: finallClips, error };
  } catch (e) {
    console.error(e);
  }
};

export default getTopClips;
