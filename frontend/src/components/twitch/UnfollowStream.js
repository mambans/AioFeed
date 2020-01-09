import axios from "axios";

import Utilities from "../../utilities/Utilities";

async function UnfollowStream(data) {
  const myUserId = await axios
    .get(`https://api.twitch.tv/helix/users?`, {
      params: {
        login: Utilities.getCookie("Twitch-username"),
      },
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .catch(error => {
      console.error(error);
    });

  const response = axios
    .delete(
      `https://api.twitch.tv/kraken/users/${myUserId.data.data[0].id}/follows/channels/${data.user_id}`,
      {
        headers: {
          Authorization: `OAuth ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      }
    )
    .then(() => {
      console.log(`Unfollowed: ${data.user_id}`);
      // data.refresh();
    });
  // .catch(error => {
  //   console.error(error);
  //   // return error;
  // });

  return response;
}

export default UnfollowStream;
