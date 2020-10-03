import axios from 'axios';
import { getCookie, AddCookie } from '../../util/Utils';
import autoReauthenticate from './autoReauthenticate';

export default async ({ authKey = getCookie(`AioFeed_AuthKey`) } = {}) => {
  const expireDate = new Date(Date.now() + 20000);
  const access_token = getCookie('Youtube-access_token');

  if (!access_token) {
    if (!getCookie('Youtube_token_validated')) {
      await axios
        .post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
        .then((res) => {
          console.log('YouTube: Valid Access_token');
          AddCookie('Youtube_token_validated', true, expireDate);
        })
        .catch(async (error) => {
          console.log('YouTube: Invalid Access_token');
          await autoReauthenticate({ authKey });
          console.log('YouTube: New Access_token fetched');
          AddCookie('Youtube_token_validated', true, expireDate);
        });
    }
    return true;
  }
  console.log('YouTube: No Access_token found');
  await autoReauthenticate({ authKey });
  console.log('YouTube: New Access_token fetched');
  AddCookie('Youtube_token_validated', true, expireDate);
};
