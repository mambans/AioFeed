import axios from 'axios';
import validateToken from './validateToken';

export const YOUTUBE_INSTANCE = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 5000,
});

YOUTUBE_INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await validateToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept'] = 'application/json';
    config.params = { ...(config.params || {}), key: process.env.REACT_APP_YOUTUBE_API_KEY };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

YOUTUBE_INSTANCE.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    console.log('YOUTUBE_INSTANCE error:', error);
    return Promise.reject(error);
  }
);

export const pagination = async (response) => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response?.data?.nextPageToken };

    return [
      ...(response?.data || []),
      ...((await pagination(await YOUTUBE_INSTANCE.get(response.config.url, { params }))) || []),
    ];
  }

  return response?.data;
};

// const controller = new AbortController();

const YoutubeAPI = {
  getVideoInfo: async (params) => {
    return await YOUTUBE_INSTANCE.get(`/videos`, {
      params,
    });
  },
  getMe: async () => {
    return await YOUTUBE_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params) => {
    return await YOUTUBE_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params, headers) => {
    return await YOUTUBE_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params, headers) => {
    return await YOUTUBE_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};
export default YoutubeAPI;
