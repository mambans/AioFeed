import AddVideoExtraData from './../AddVideoExtraData';
import API from '../API';

export default async (category, sortBy, page) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((window.innerWidth - 150) / 350) * Math.floor((window.innerHeight - 150) / 340);

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
    const topVideos = await API.getVideos({
      params: {
        first: nrStreams,
        game_id: game?.id,
        sort: sortBy && sortBy?.toLowerCase(),
        type: 'all',
        period: 'all',
        after: page ? page.pagination.cursor : null,
      },
    }).catch((e) => {
      console.error(e.message);
      error = e;
      return e;
    });

    const finallTopVideos = await AddVideoExtraData({
      items: topVideos.data,
      fetchGameInfo: false,
      saveNewProfiles: false,
    });

    return { topData: finallTopVideos, error };
  } catch (e) {
    console.error(e);
  }
};
