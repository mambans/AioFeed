import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';

const getTopStreams = async (category, page, feedVideoSizeProps) => {
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

  const topStreams = await TwitchAPI.getStreams({
    first: nrStreams,
    game_id: game?.id,
    after: page ? page.pagination.cursor : null,
  });

  console.log('topStreams:', topStreams);
  const finallData = await AddVideoExtraData({ items: topStreams.data, saveNewProfiles: false });

  return { topData: finallData, error };
};
export default getTopStreams;
