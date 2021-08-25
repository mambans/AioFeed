import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';

const getTopStreams = async (category, page) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((window.innerWidth - 150) / 350) * Math.floor((window.innerHeight - 150) / 340);

  if (category && category !== 'undefined') {
    game = await TwitchAPI.getGames({
      name: category,
    }).then((res) => res.data.data[0]);
  } else {
    game = { id: null };
  }
  try {
    const topStreams = await TwitchAPI.getStreams({
      first: nrStreams,
      game_id: game?.id,
      after: page ? page.pagination.cursor : null,
    }).catch((e) => {
      console.error(e.message);
      error = e;
      return e;
    });

    const finallData = await AddVideoExtraData({ items: topStreams.data, saveNewProfiles: false });

    return { topData: finallData, error };
  } catch (e) {
    console.error(e);
  }
};
export default getTopStreams;
