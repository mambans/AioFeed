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
  let error;
  const nrStreams =
    Math.floor((window.innerWidth - 150) / (feedVideoSizeProps?.totalWidth || 350)) *
    Math.floor((window.innerHeight - 150) / (feedVideoSizeProps?.height || 340));

  const game = (async () => {
    console.log('category:', category);
    if (category && category !== 'undefined') {
      return await TwitchAPI.getGames({
        name: category,
      }).then((res) => {
        console.log('res:', res);
        return res?.data?.data[0];
      });
    } else {
      return { id: null };
    }
  })();

  console.log('game:', game);
  const topClips = await TwitchAPI.getClips({
    first: nrStreams,
    game_id: game?.id,
    after: page ? page.pagination.cursor : null,
    started_at: sortByTime
      ? new Date(new Date().setDate(new Date().getDate() - sortByTime)).toISOString()
      : null,
    ended_at: sortByTime && new Date().toISOString(),
  }).catch((e) => {
    console.error(e?.message || e);
    error = e;
    return e;
  });
  console.log('topClips:', topClips);

  const finallClips = await AddVideoExtraData({
    items: { data: topClips },
    saveNewProfiles: false,
  });

  return { topData: finallClips, error };
};

export default getTopClips;
