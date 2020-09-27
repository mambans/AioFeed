import axios from 'axios';
import { getCookie, AddCookie } from '../../util/Utils';
import reauthenticate from './reauthenticate';

export default async (forceRun = false) => {
  if (getCookie('Twitch-access_token')) {
    if (
      forceRun ||
      !getCookie('Twitch_token_validated') ||
      getCookie('Twitch_token_validated') < Date.now()
    ) {
      const expireDate = new Date(Date.now() + 5000);
      AddCookie('Twitch_token_validated', expireDate.getTime(), expireDate);
      return await axios
        .get('https://id.twitch.tv/oauth2/validate', {
          headers: {
            Authorization: `OAuth ${getCookie('Twitch-access_token')}`,
          },
        })
        .then((res) => {
          const expireDate = new Date(Date.now() + 60000);
          AddCookie('Twitch_token_validated', expireDate.getTime(), expireDate);
          if (
            res.data.client_id === process.env.REACT_APP_TWITCH_CLIENT_ID &&
            res.data.login === getCookie('Twitch-username').toLocaleLowerCase()
          ) {
            return res.data;
          }
          console.warn('Token details DID NOT match.');
          return reauthenticate();
        })
        .catch((error) => {
          // console.error("error", error.response.statusText);
          // console.error("error status", error.response.status);
          console.log('Invalid token');
          return reauthenticate();
        });
    }

    return true;
  } else if (getCookie(`Twitch-refresh_token`)) {
    return reauthenticate();
  }
  return false;
};
