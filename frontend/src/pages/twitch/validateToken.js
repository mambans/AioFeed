import { Auth } from 'aws-amplify';
import axios from 'axios';
import { getCookie } from '../../util';
import API from '../navigation/API';

const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
// const validateController = new AbortController();
let promise = null;

const validateToken = async (NoAuthNeddedAndFallbackToAppToken) => {
  if (!NoAuthNeddedAndFallbackToAppToken) {
    if (!(await Auth.currentAuthenticatedUser())) return null;
  }

  const validPromise = await validationOfToken(NoAuthNeddedAndFallbackToAppToken);
  return validPromise?.data?.access_token;
};

const validationOfToken = async (NoAuthNeddedAndFallbackToAppToken) => {
  if (!promise?.requestPromise || Date.now() > promise?.ttl) {
    const request = validateTokenFunc(NoAuthNeddedAndFallbackToAppToken);
    promise = {
      requestPromise: request,
      ttl: Date.now() + ((request?.data?.expires_in || 30) - 20) * 1000,
    };
  }

  return promise?.requestPromise;
};

const validateTokenFunc = async (NoAuthNeddedAndFallbackToAppToken) => {
  console.log('--validateTokenFunc--:');
  const access_token = getCookie('Twitch-access_token');
  const app_token = getCookie(`Twitch-app_token`);
  const refresh_token = getCookie(`Twitch-refresh_token`);

  try {
    if (access_token) {
      return await fullValidateFunc();
    } else if (refresh_token) {
      return await API.reauthenticateTwitchToken();
    } else if (app_token && NoAuthNeddedAndFallbackToAppToken) {
      return validateFunction(app_token).then(async (res) => {
        const { client_id } = res?.data || {};
        if (client_id === TWITCH_CLIENT_ID) return res;
        const appTokenRequest = await API.getAppAccessToken();
        return appTokenRequest;
      });
    }
  } catch (e) {
    console.log('validateTokenFunc catch e:', e);
    if (NoAuthNeddedAndFallbackToAppToken) {
      const appTokenRequest = await API.getAppAccessToken();
      return appTokenRequest;
    }
  }
};

const fullValidateFunc = async () => {
  const access_token = getCookie('Twitch-access_token');
  const res = await validateFunction(access_token);
  const { client_id, user_id } = res?.data || {};

  if (client_id === TWITCH_CLIENT_ID && user_id === getCookie('Twitch-userId')) {
    return res;
  }

  console.warn('Twitch: Token validation details DID NOT match.');
  return await API.reauthenticateTwitchToken();
};

const validateFunction = async (token) => {
  // validateController.abort();
  const access_token = token || getCookie('Twitch-access_token');
  const res = await axios
    .get('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
      // signal: validateController.signal,
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        return;
      }
      console.log('e:', e);
      throw e;
    });

  if (res?.data)
    res.data.access_token = res?.config?.headers?.Authorization?.split?.(' ')?.[1] || access_token;

  return res;
};

export default validateToken;
