import axios from 'axios';
import { AddCookie, getCookie } from '../../util/Utils';

const BASE_URL = 'https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod';

const API = {
  addCustomfilters: async (value) =>
    await axios
      .put(`${BASE_URL}/customfilters`, {
        username: getCookie(`AioFeed_AccountName`),
        filtesObj: value,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  getCustomfilters: async () =>
    await axios
      .get(`${BASE_URL}/customfilters`, {
        params: {
          username: getCookie(`AioFeed_AccountName`),
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then((res) => res.data.Item?.filters || {})
      .catch((e) => {
        console.error(e);
        return {};
      }),

  getTwitchAccessToken: async (value) =>
    await axios
      .put(`${BASE_URL}/rerequest/twitch`, {
        authCode: value,
      })
      .catch((e) => console.error(e)),

  updateVodChannels: async (value) =>
    await axios
      .put(`${BASE_URL}/vodchannels`, {
        username: getCookie(`AioFeed_AccountName`),
        authkey: getCookie(`AioFeed_AuthKey`),
        channels: [...value],
      })
      .catch((e) => console.error(e)),

  updateSavedList: async (listName, value) =>
    await axios
      .put(`${BASE_URL}/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        listName: listName,
        videosObj: value,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  getSavedList: async () =>
    await axios
      .get(`${BASE_URL}/savedlists`, {
        params: {
          username: getCookie(`AioFeed_AccountName`),
        },
      })
      .then((res) => {
        delete res.data.Item?.Username;
        return res.data.Item;
      })
      .catch((e) => console.error(e)),

  deleteSavedList: async (listName) =>
    await axios
      .put(`${BASE_URL}/savedlists/delete`, {
        username: getCookie('AioFeed_AccountName'),
        listName,
      })
      .catch((e) => console.error(e)),

  addUdateChannels: async (channels) =>
    await axios
      .put(`${BASE_URL}/updatechannels`, {
        username: getCookie('AioFeed_AccountName'),
        authkey: getCookie(`AioFeed_AuthKey`),
        channels,
      })
      .catch((e) => console.error(e)),

  deleteYoutubeToken: async () =>
    await axios
      .delete(`${BASE_URL}/youtube/token`, {
        data: {
          username: getCookie('AioFeed_AccountName'),
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then(() => console.log(`Successfully disconnected from Youtube`))
      .catch((e) => console.error(e)),

  getYoutubeTokens: async (codeFromUrl) => {
    const data = {
      username: getCookie('AioFeed_AccountName'),
      authkey: getCookie(`AioFeed_AuthKey`),
    };

    if (codeFromUrl) data.code = codeFromUrl;

    return await axios
      .post(`${BASE_URL}/youtube/token`, data)
      .then(async (res) => {
        console.log('YouTube: New Access token fetched');
        return {
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        };
      })
      .catch((e) => console.error(e));
  },

  getMonitoredVodChannelsList: async () =>
    await axios
      .get(`${BASE_URL}/preferences`, {
        params: {
          username: getCookie('AioFeed_AccountName'),
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then((res) => res?.data)
      .catch((e) => console.error(e)),

  getAppAccessToken: async () =>
    await axios
      .get(`${BASE_URL}/app/token`)
      .then(({ data: { access_token, expires_in } }) => {
        const expireData = new Date(expires_in * 1000);
        AddCookie('Twitch-app_token', access_token, expireData);
        return access_token;
      })
      .catch((e) => {
        console.error(e);
        console.error('No User or App access tokens found.');
      }),

  updateTwitchToken: async (setTwitchToken, setRefreshToken) =>
    await axios
      .put(`${BASE_URL}/reauth/twitch`, {
        refresh_token: getCookie(`Twitch-refresh_token`),
        username: getCookie(`AioFeed_AccountName`),
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .then(async (res) => {
        AddCookie('Twitch-access_token', res.data.access_token);
        AddCookie('Twitch-refresh_token', res.data.refresh_token);
        if (setTwitchToken) setTwitchToken(res.data.access_token);
        if (setRefreshToken) setRefreshToken(res.data.refresh_token);
        console.log('Successfully re-authenticated to Twitch.');

        return res.data.access_token;
      })
      .catch(() => console.log('!Failed to re-authenticate with Twitch.')),

  deleteTwitchToken: async () =>
    await axios
      .delete(`${BASE_URL}/twitch/token`, {
        data: {
          username: getCookie('AioFeed_AccountName'),
          authkey: getCookie(`AioFeed_AuthKey`),
        },
      })
      .then(() => console.log(`Successfully disconnected from Twitch`))
      .catch((e) => console.error(e)),

  updateAccount: async (columnName, columnValue) =>
    await axios
      .put(`${BASE_URL}/account/update`, {
        username: getCookie('AioFeed_AccountName'),
        columnName: columnName,
        columnValue: columnValue,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  softUpdateAccount: async (columnName, columnValue) =>
    await axios
      .put(`${BASE_URL}/account/soft-update`, {
        username: getCookie('AioFeed_AccountName'),
        columnName: columnName,
        columnValue: columnValue,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e)),

  login: async (username, password) =>
    await axios.post(`${BASE_URL}/account/login`, {
      username,
      password,
    }),

  deleteAccount: async (username, password, authKey) =>
    await axios.delete(`${BASE_URL}/account`, {
      data: { username, password, authKey },
    }),

  createAccount: async (username, password, email) =>
    await axios.post(`${BASE_URL}/account/create`, {
      username,
      password,
      email,
    }),
  updateFavoriteStreams: async (value) =>
    await axios
      .put(`${BASE_URL}/favoritestreams`, {
        username: getCookie(`AioFeed_AccountName`),
        authkey: getCookie(`AioFeed_AuthKey`),
        channels: [...value],
      })
      .catch((e) => console.error(e)),
};

export default API;
