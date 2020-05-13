import axios from "axios";
import { getCookie, RemoveCookie } from "../../util/Utils";

export default async ({ setTwitchToken, setEnableTwitch }) => {
  await axios
    .post(
      `https://id.twitch.tv/oauth2/revoke?client_id=${
        process.env.REACT_APP_TWITCH_CLIENT_ID
      }&token=${getCookie("Twitch-access_token")}`
    )
    .catch((er) => {
      console.error(er);
    });

  RemoveCookie("Twitch-access_token");
  RemoveCookie("Twitch-refresh_token");
  RemoveCookie("Twitch-userId");
  RemoveCookie("Twitch-username");
  RemoveCookie("Twitch-profileImg");
  RemoveCookie("TwitchVods_FeedEnabled");
  RemoveCookie("Twitch-myState");
  RemoveCookie("Twitch_AutoRefresh");

  setTwitchToken();
  setEnableTwitch(false);

  await axios
    .delete(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/twitch/token`, {
      data: {
        username: getCookie("AioFeed_AccountName"),
        authkey: getCookie(`AioFeed_AuthKey`),
      },
    })
    .then(() => {
      console.log(`Successfully disconnected from Twitch`);
    })
    .catch((e) => {
      console.error(e);
    });
};
