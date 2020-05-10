import axios from "axios";
import { getCookie, AddCookie } from "../../util/Utils";
import reauthenticate from "./reauthenticate";

export default async () => {
  if (!getCookie("Twitch_token_validated")) {
    await axios
      .get("https://id.twitch.tv/oauth2/validate", {
        headers: {
          Authorization: `OAuth ${getCookie("Twitch-access_token")}`,
        },
      })
      .then((res) => {
        const expireDate = new Date(Date.now() + 60000);
        AddCookie("Twitch_token_validated", true, expireDate);
        return res.data;
      })
      .catch((error) => {
        // console.error("error", error.response.statusText);
        // console.error("error status", error.response.status);
        console.log("Invalid token");
        return reauthenticate();
      });
  } else {
    return true;
  }
};
