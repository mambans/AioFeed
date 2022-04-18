import axios from 'axios';
import { getCookie } from '../../util';
import API from '../navigation/API';
import reauthenticate from './reauthenticate';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
let promise = null;

const validateToken = async ({ useApp_token_last = false } = {}) => {
  const validPromise = await validationOfToken({ useApp_token_last });
  console.log('validPromise:', validPromise);
  return validPromise;
};

const validationOfToken = async ({ useApp_token_last } = {}) => {
  if (!promise?.promise || Date.now() > promise?.ttl) {
    const request = await validateTokenFunc({ useApp_token_last });
    console.log('request:', request);
    promise = {
      promise: request?.data?.access_token,
      ttl: Date.now() + ((request?.data?.expires_in || 20) - 20) * 1000,
    };
  }
  return promise.promise;
};

const validateTokenFunc = async ({ useApp_token_last }) => {
  console.log('--CALLING validateTokenFunc:');
  const access_token = getCookie('Twitch-access_token');
  const refresh_token = getCookie(`Twitch-refresh_token`);
  const app_token = getCookie(`Twitch-app_token`);

  if (access_token) {
    return await fullValidateFunc();
  } else if (refresh_token) {
    console.log('Twitch: No Twitch-access_token avalible, trying with Twitch-refresh_token.');
    return reauthenticate();
  } else if (app_token && useApp_token_last) {
    return validateFunction(app_token)
      .then(async (res) => {
        const { client_id } = res?.data || {};
        if (client_id === TWITCH_CLIENT_ID) return res;
        console.warn('Twitch: Token validation details DID NOT match.');

        const appTokenRequest = fetchAppAccessToken();
        console.log('appTokenRequest:', appTokenRequest);
        return appTokenRequest;
      })
      .catch(async (error) => {
        console.error('error: ', error);
        console.warn('Twitch: Validation failed!');

        const appTokenRequest = fetchAppAccessToken();
        console.log('appTokenRequest:', appTokenRequest);
        return appTokenRequest;
      });
  }
  const appTokenRequest = fetchAppAccessToken();
  console.log('appTokenRequest:', appTokenRequest);
  return appTokenRequest;
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

  res.data.access_token = res?.config?.headers?.Authorization?.split(' ')?.[1] || access_token;
  return res;
};

const fetchAppAccessToken = async () => await API.getAppAccessToken();

export default validateToken;
