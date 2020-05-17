import AddVideoExtraData from "../AddVideoExtraData";
import API from "../API";

export default async (category, page) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 150) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 60)) / 351);

  if (category && category !== "undefined") {
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
    const topStreams = await API.getStreams({
      params: {
        first: nrStreams,
        game_id: game.id,
        after: page ? page.pagination.cursor : null,
      },
    }).catch((e) => {
      console.error(e.message);
      error = e;
      return e;
    });

    const finallData = await AddVideoExtraData(topStreams);

    return { topData: finallData, error };
  } catch (e) {
    console.error(e);
  }
};
