import axios from "axios";

import Utilities from "../../utilities/Utilities";

async function UnfollowStream(data) {
  const { user_id, setTwitchToken, twitchToken, setRefreshToken } = data;

  const myUserId = await axios
    .get(`https://api.twitch.tv/helix/users?`, {
      params: {
        login: Utilities.getCookie("Notifies_TwitchDisplayName"),
      },
      headers: {
        Authorization: `Bearer ${twitchToken}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .catch(async error => {
      console.error(error);
    });

  const response = await axios
    .delete(
      `https://api.twitch.tv/kraken/users/${myUserId.data.data[0].id}/follows/channels/${user_id}`,
      {
        headers: {
          Authorization: `OAuth ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      }
    )
    .then(() => {
      console.log(`Unfollowed: ${user_id}`);
      // data.refresh();
    })
    .catch(async e => {
      console.error(e);
      console.log("Re-authenticating with Twitch.");

      await axios
        .post(
          `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
            Utilities.getCookie("Twitch-refresh_token")
          )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
            process.env.REACT_APP_TWITCH_SECRET
          }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
        )
        .then(async res => {
          setTwitchToken(res.data.access_token);
          setRefreshToken(res.data.refresh_token);
          document.cookie = `Twitch-access_token=${res.data.access_token}; path=/`;
          document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/`;

          await axios
            .delete(
              `https://api.twitch.tv/kraken/users/${myUserId.data.data[0].id}/follows/channels/${user_id}`,
              {
                headers: {
                  Authorization: `OAuth ${res.data.access_token}`,
                  "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                  Accept: "application/vnd.twitchtv.v5+json",
                },
              }
            )
            .then(() => {
              console.log(`Unfollowed: ${user_id}`);
              // data.refresh();
            });
        });
    });

  return response;
}

export default UnfollowStream;
