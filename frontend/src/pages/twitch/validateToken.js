import axios from 'axios';
import { getCookie } from '../../util';
import API from '../navigation/API';
import reauthenticate from './reauthenticate';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
let promise = null;

const validateToken = async () => {
  const validPromise = await validationOfToken();
  console.log('validPromise:', validPromise);
  return validPromise;
};

const validationOfToken = async () => {
  if (!promise?.promise || Date.now() > promise?.ttl) {
    const request = await validateTokenFunc();
    console.log('request:', request);
    promise = {
      promise: request?.data?.access_token,
      ttl: Date.now() + ((request?.data?.expires_in || 20) - 20) * 1000,
    };
  }
  return promise.promise;
};

const validateTokenFunc = async () => {
  const access_token = getCookie('Twitch-access_token');
  const refresh_token = getCookie(`Twitch-refresh_token`);
  // const app_token = getCookie(`Twitch-app_token`);

  if (access_token) {
    return await fullValidateFunc();
  } else if (refresh_token) {
    console.log('Twitch: No Twitch-access_token avalible, trying with Twitch-refresh_token.');
    return reauthenticate();
  }
  // else if (app_token) {
  //   return validateFunction(app_token)
  //     .then(async ({ data: { client_id } }) => {
  //       if (client_id === TWITCH_CLIENT_ID) return app_token;
  //       console.warn('Twitch: Token validation details DID NOT match.');

  //       return fetchAppAccessToken();
  //     })
  //     .catch(async (error) => {
  //       console.error('error: ', error);
  //       console.warn('Twitch: Validation failed!');

  //       return fetchAppAccessToken();
  //     });
  // }
  return fetchAppAccessToken();
};
// res.data.access_token

const fullValidateFunc = async () => {
  const access_token = getCookie('Twitch-access_token');

  try {
    const res = await validateFunction(access_token);
    console.log('res22:', res);
    const { client_id, user_id } = res?.data || {};

    if (client_id === TWITCH_CLIENT_ID && user_id === getCookie('Twitch-userId')) {
      return res;
    }
    console.warn('Twitch: Token validation details DID NOT match.');
    return await reauthenticate();
  } catch (error) {
    console.error('error: ', error);
    console.warn('Twitch: Validation failed!');
    return await reauthenticate();
  }
};

const validateFunction = async (token) => {
  const access_token = token || getCookie('Twitch-access_token');
  const res = await axios.get('https://id.twitch.tv/oauth2/validate', {
    headers: {
      Authorization: `OAuth ${access_token}`,
    },
  });

  console.log('res7:', res);
  return res;
};

const fetchAppAccessToken = async () => await API.getAppAccessToken();

export default validateToken;
