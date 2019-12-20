import axios from "axios";

import Utilities from "./../../../utilities/Utilities";

export default async () => {
  const topGames = await axios.get(`https://api.twitch.tv/helix/games/top`, {
    params: {
      first: 100,
    },
    headers: {
      Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  });
  return topGames;
};
