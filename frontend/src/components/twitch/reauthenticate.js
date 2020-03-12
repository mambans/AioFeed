import axios from "axios";
import Util from "./../../util/Util";

export default async (setTwitchToken, setRefreshToken) => {
  console.log("---Re-authenticating with Twitch.---");

  return await axios
    .post(
      `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
        Util.getCookie(`Twitch-refresh_token`)
      )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
        process.env.REACT_APP_TWITCH_SECRET
      }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
    )
    .then(async res => {
      setTwitchToken(res.data.access_token);
      setRefreshToken(res.data.refresh_token);
      document.cookie = `Twitch-access_token=${res.data.access_token}; path=/; SameSite=Lax`;
      document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/; SameSite=Lax`;
      console.log("Successfully re-authenticated to Twitch.");

      return res.data.access_token;
    })
    .catch(() => {
      console.log("!Failed to re-authenticate with Twitch.");
    });
};
