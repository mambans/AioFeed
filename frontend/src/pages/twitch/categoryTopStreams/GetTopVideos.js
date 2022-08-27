import AddVideoExtraData from './../AddVideoExtraData';
import TwitchAPI from '../API';

const getTopVideos = async (category, sortBy, page, feedVideoSizeProps) => {
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

  const topVideos = await TwitchAPI.getVideos({
    first: nrStreams,
    game_id: game?.id,
    sort: sortBy && sortBy?.toLowerCase(),
    type: 'all',
    period: 'all',
    after: page ? page.pagination.cursor : null,
  }).catch((e) => {
    console.error(e?.message || e);
    error = e;
    return e;
  });

  const finallTopVideos = await AddVideoExtraData({
    items: topVideos.data,
    fetchGameInfo: false,
    saveNewProfiles: false,
  });

  return { topData: finallTopVideos, error };
};
export default getTopVideos;
