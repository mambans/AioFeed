import axios from 'axios';
import { getCookie } from '../../util/Utils';
import reauthenticate from './reauthenticate';

export default async () => {
  const access_token = getCookie('Twitch-access_token');
  const refresh_token = getCookie(`Twitch-refresh_token`);

  if (access_token) {
    // console.log('Twitch: Validating token..');
    return await axios
      .get('https://id.twitch.tv/oauth2/validate', {
        headers: {
          Authorization: `OAuth ${access_token}`,
        },
      })
      .then((res) => {
        // console.log('Twitch: Validation succesfull.');
        if (
          res.data.client_id === process.env.REACT_APP_TWITCH_CLIENT_ID &&
          res.data.login === getCookie('Twitch-username').toLocaleLowerCase()
        ) {
          return res.data;
        }
        console.warn('Twitch: Token validation details DID NOT match.');
        return reauthenticate();
      })
      .catch((error) => {
        // console.error("error", error.response.statusText);
        // console.error("error status", error.response.status);
        console.warn('Twitch: Validation failed!');
        return reauthenticate();
      });
  } else if (refresh_token) {
    console.log('Twitch: No Twitch-access_token avalible, trying with Twitch-refresh_token.');
    return reauthenticate();
  }
  console.warn('Twitch: No tokens found.');
  throw new Error('No tokens found.');
};
