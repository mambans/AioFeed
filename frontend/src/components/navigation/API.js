import axios from 'axios';
import { AddCookie, getCookie } from '../../util';
import addLogBase from './../logs/addLogBase';

const BASE_URL = 'https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod';

const API = {
  validateAccount: async (username) =>
    await axios.post(`${BASE_URL}/account/validate`, {
      authkey: getCookie(`AioFeed_AuthKey`),
    }),
  addCustomfilters: async (value) =>
    await axios
      .put(`${BASE_URL}/customfilters`, {
        filtesObj: value,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  getCustomfilters: async () =>
    await axios
      .get(`${BASE_URL}/customfilters`, {
        params: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then((res) => res.data.Item?.filters || {})
      .catch((e) => {
        console.error(e);
        return {};
      }),

  createSavedList: async (id, values) =>
    await axios
      .post(`${BASE_URL}/savedlists`, {
        id: id,
        obj: values,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  updateSavedList: async (id, values) =>
    await axios
      .put(`${BASE_URL}/savedlists`, {
        id: id,
        obj: values,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  getSavedList: async () =>
    await axios
      .get(`${BASE_URL}/savedlists`, {
        params: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => console.error(e)),

  deleteSavedList: async (id) =>
    await axios
      .put(`${BASE_URL}/savedlists/delete`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        id,
      })
      .catch((e) => console.error(e)),

  deleteYoutubeToken: async () =>
    await axios
      .delete(`${BASE_URL}/youtube/token`, {
        data: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then(() => console.log(`Successfully disconnected from Youtube`))
      .catch((e) => console.error(e)),

  getYoutubeTokens: async (codeFromUrl) => {
    const data = {
      authkey: getCookie(`AioFeed_AuthKey`),
    };

    if (codeFromUrl) data.code = codeFromUrl;

    return await axios
      .post(`${BASE_URL}/youtube/token`, data)
      .then(async (res) => {
        if (res.data.access_token || res.data.refresh_token) {
          console.log('YouTube: New Access token fetched');
          addLogBase({
            title: 'YouTube re-authenticated',
            text: 'Successfully re-authenticated to YouTube (renewed access token)',
            icon: 'youtube',
          });
          return {
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          };
        }
      })
      .catch((e) => console.error(e));
  },

  getAppAccessToken: async () =>
    await axios
      .get(`${BASE_URL}/app/token`)
      .then(({ data: { access_token, expires_in } }) => {
        const expireData = new Date(expires_in * 1000);
        AddCookie('Twitch-app_token', access_token, { expires: expireData });
        return access_token;
      })
      .catch((e) => {
        console.error(e);
        console.error('No User or App access tokens found.');
      }),

  login: async (username, password) =>
    await axios.post(`${BASE_URL}/account/login`, {
      username,
      password,
    }),

  deleteAccount: async (password, authKey) =>
    await axios.delete(`${BASE_URL}/account`, {
      data: { password, authKey },
    }),

  createAccount: async (username, password, email) =>
    await axios.post(`${BASE_URL}/account/create`, {
      username,
      password,
      email,
    }),
  changePassword: async ({ password, newPassword, authKey }) =>
    await axios.put(`${BASE_URL}/account/reset`, {
      password: password,
      new_password: newPassword,
      authkey: authKey,
    }),

  createCustomFeedSections: async ({ id, data }) => {
    return await axios
      .post(`${BASE_URL}/custom_feed_sections`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        id,
        data,
      })
      .catch((e) => console.error(e));
  },
  fetchCustomFeedSections: async () =>
    await axios
      .get(`${BASE_URL}/custom_feed_sections`, {
        params: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => console.error(e)),

  deleteCustomFeedSections: async (id) =>
    await axios
      .delete(`${BASE_URL}/custom_feed_sections`, {
        data: {
          authkey: getCookie(`AioFeed_AuthKey`),
          id,
        },
      })
      .catch((e) => console.error(e)),

  updateCustomFeedSections: async (id, data) => {
    return await axios
      .put(`${BASE_URL}/custom_feed_sections`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        id,
        data,
      })
      .catch((e) => console.error(e));
  },
  //new refactored to seperate tables
  changeProfileImage: async (data) =>
    await axios
      .put(`${BASE_URL}/account/profile-image`, {
        data,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  updateTwitchUserData: async (data, access_token, refresh_token) =>
    await axios
      .put(`${BASE_URL}/twitch/user`, {
        data,
        access_token,
        refresh_token,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),
  updateYoutubeUserData: async (data, access_token, refresh_token) =>
    await axios
      .put(`${BASE_URL}/youtube/user`, {
        data,
        access_token,
        refresh_token,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  getTwitchData: async () =>
    await axios
      .get(`${BASE_URL}/twitch`, {
        params: { authkey: getCookie(`AioFeed_AuthKey`) },
      })
      .catch((e) => console.error(e)),

  updateFavoriteStreams: async (value) =>
    await axios
      .put(`${BASE_URL}/twitch/favorite_streams`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        channels: [...value],
      })
      .catch((e) => console.error(e)),

  updateVodChannels: async (value) =>
    await axios
      .put(`${BASE_URL}/twitch/vod-channels`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        channels: [...value],
      })
      .catch((e) => console.error(e)),

  addUdateChannels: async (channels) =>
    await axios
      .put(`${BASE_URL}/twitch/update-notis-channels`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        channels,
      })
      .catch((e) => console.error(e)),

  deleteTwitchDataUser: async () =>
    await axios
      .delete(`${BASE_URL}/twitch/user`, {
        data: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then(() => console.log(`Successfully disconnected from Twitch`))
      .catch((e) => console.error(e)),

  updateTwitchToken: async (
    setTwitchToken = (v) => AddCookie('Twitch-access_token', v),
    setRefreshToken = (v) => AddCookie('Twitch-refresh_token', v)
  ) =>
    await axios
      .put(`${BASE_URL}/twitch/reauth`, {
        refresh_token: getCookie(`Twitch-refresh_token`),
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .then(async (res) => {
        setTwitchToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        console.log('Successfully re-authenticated to Twitch.');
        addLogBase({
          title: 'Twitch re-authenticated',
          text: 'Successfully re-authenticated to Twitch (renewed access token)',
          icon: 'twitch',
        });

        return res.data.access_token;
      })
      .catch(() => console.log('!Failed to re-authenticate with Twitch.')),

  getTwitchAccessToken: async (value) =>
    await axios
      .put(`${BASE_URL}/twitch/request_auth`, {
        authCode: value,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),
  getYoutubeData: async () =>
    await axios
      .get(`${BASE_URL}/youtube`, {
        params: { authkey: getCookie(`AioFeed_AuthKey`) },
      })
      .catch((e) => console.error(e)),
  addTwitterList: async (data) =>
    await axios
      .put(`${BASE_URL}/twitter`, {
        authkey: getCookie(`AioFeed_AuthKey`),
        data,
      })
      .catch((e) => console.error(e)),
  getTwitterLists: async (data) =>
    await axios
      .get(`${BASE_URL}/twitter`, {
        params: {
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .catch((e) => console.error(e)),
};

export default API;
