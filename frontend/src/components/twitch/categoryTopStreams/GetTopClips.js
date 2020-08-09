import AddVideoExtraData from '../AddVideoExtraData';
import API from '../API';

/**
 * Fetch Clips
 * @param {string} category - category to fetch clips from
 * @param {Number} sortByTime - Days behind today to start fetch clips from.
 * @param {object} [page] - Pagination cursor for next page.
 * @returns {Object} {topData , error}
 * @async
 */
export default async (category, sortByTime, page) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 150) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 60)) / 351);

  if (category && category !== 'undefined') {
    game = await API.getGames({
      params: {
        name: category,
      },
    }).then((res) => {
      return res.data.data[0];
    });
  } else {
    game = { id: null };
  }
  try {
    const topClips = await API.getClips({
      params: {
        first: nrStreams,
        game_id: game.id,
        after: page ? page.pagination.cursor : null,
        started_at: sortByTime
          ? new Date(new Date().setDate(new Date().getDate() - sortByTime)).toISOString()
          : null,
        ended_at: sortByTime && new Date().toISOString(),
      },
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
