import axios from 'axios';

import { AddCookie, getCookie } from '../../util/Utils';

export default async ({ authKey = getCookie(`AioFeed_AuthKey`) }) => {
  return await axios
    .post(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/youtube/token`, {
      username: getCookie('AioFeed_AccountName'),
      authkey: authKey,
    })
    .then(async (res) => {
      console.log('YouTube: New Access_token fetched');
      AddCookie('Youtube-access_token', res.data.access_token);
      return res.data.access_token;
    })
    .catch((e) => {
      console.error(e);
      throw new Error(e.message);
    });
};
