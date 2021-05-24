import axios from 'axios';
import { AddCookie, getCookie } from '../../util/Utils';
import reauthenticate from './reauthenticate';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

const validateFunction = async (token) =>
  await axios.get('https://id.twitch.tv/oauth2/validate', {
    headers: {
      Authorization: `OAuth ${token}`,
    },
  });

const fetchAppAccessToken = async () => {
  return await axios
    .get('https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/app/token')
    .then(({ data: { access_token, expires_in } }) => {
      const expireData = new Date(expires_in * 1000);
      AddCookie('Twitch-app_token', access_token, expireData);
      return access_token;
    })
    .catch((error) => {
      console.error('error: ', error);
      throw new Error('No User or App access tokens found.');
    });
};

export default async () => {
  const access_token = getCookie('Twitch-access_token');
  const refresh_token = getCookie(`Twitch-refresh_token`);
  const app_token = getCookie(`Twitch-app_token`);

  if (access_token) {
    return validateFunction(access_token)
      .then(({ data: { client_id, login, user_id } }) => {
        if (
          client_id === TWITCH_CLIENT_ID &&
          user_id === getCookie('Twitch-userId') &&
          login.toLocaleLowerCase() === getCookie('Twitch-username')?.toLocaleLowerCase()
        ) {
          return access_token;
        }
        console.warn('Twitch: Token validation details DID NOT match.');

        return reauthenticate();
      })
      .catch((error) => {
        console.error('error: ', error);
        console.warn('Twitch: Validation failed!');

        return reauthenticate();
      });
  } else if (refresh_token) {
    console.log('Twitch: No Twitch-access_token avalible, trying with Twitch-refresh_token.');

    return reauthenticate();
  } else if (app_token) {
    return validateFunction(app_token)
      .then(async ({ data: { client_id } }) => {
        if (client_id === TWITCH_CLIENT_ID) return app_token;
        console.warn('Twitch: Token validation details DID NOT match.');

        return fetchAppAccessToken();
      })
      .catch(async (error) => {
        console.error('error: ', error);
        console.warn('Twitch: Validation failed!');

        return fetchAppAccessToken();
      });
  }
  return fetchAppAccessToken();
};
