import axios from "axios";

import { getCookie } from "./../../../util/Utils";

export default async () => {
  const topGames = await axios
    .get(`https://api.twitch.tv/helix/games/top`, {
      params: {
        first: 100,
      },
      headers: {
        Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .catch((error) => {
      console.log(error);
    });
  return topGames.data.data;
};
