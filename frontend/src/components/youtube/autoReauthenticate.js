import axios from "axios";

import { AddCookie, getCookie } from "../../util/Utils";

export default async ({ authKey }) => {
  return await axios
    .post(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/youtube/token`, {
      username: getCookie("AioFeed_AccountName"),
      authkey: authKey,
    })
    .then(async (res) => {
      AddCookie("Youtube-access_token", res.data.access_token);
      return res.data.access_token;
    })
    .catch((e) => {
      console.error(e);
    });
};
