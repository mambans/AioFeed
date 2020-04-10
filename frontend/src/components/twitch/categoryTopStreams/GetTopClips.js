import axios from "axios";

import Util from "./../../../util/Util";
import AddVideoExtraData from "../AddVideoExtraData";

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

  if (category && category !== "undefined") {
    game = await axios
      .get(`https://api.twitch.tv/helix/games`, {
        params: {
          name: category,
        },
        headers: {
          Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then((res) => {
        return res.data.data[0];
      });
  } else {
    game = { id: null };
  }
  try {
    const topClips = await axios
      .get(`https://api.twitch.tv/helix/clips`, {
        params: {
          first: nrStreams,
          game_id: game.id,
          after: page ? page.pagination.cursor : null,
          started_at:
            sortByTime &&
            new Date(new Date().setDate(new Date().getDate() - sortByTime)).toISOString(),
          ended_at: sortByTime && new Date().toISOString(),
        },
        headers: {
          Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .catch((e) => {
        console.error(e.message);
        error = e;
        return e;
      });

    const finallClips = await AddVideoExtraData(topClips);

    return { topData: finallClips, error };
  } catch (e) {
    console.error(e);
  }
};
