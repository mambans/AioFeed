import axios from "axios";
import { getCookie } from "./../../util/Utils";
import { AddCookie } from "../../util/Utils";

export default async (setTwitchToken, setRefreshToken) => {
  console.log("---Re-authenticating with Twitch.---");

  return await axios
    .put("https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/reauth/twitch", {
      refresh_token: getCookie(`Twitch-refresh_token`),
      username: getCookie(`AioFeed_AccountName`),
      authkey: getCookie(`AioFeed_AuthKey`),
    })
    .then(async (res) => {
      AddCookie("Twitch-access_token", res.data.access_token);
      AddCookie("Twitch-refresh_token", res.data.refresh_token);
      if (setTwitchToken) setTwitchToken(res.data.access_token);
      if (setRefreshToken) setRefreshToken(res.data.refresh_token);
      console.log("Successfully re-authenticated to Twitch.");

      return res.data.access_token;
    })
    .catch(() => {
      console.log("!Failed to re-authenticate with Twitch.");
    });
};
