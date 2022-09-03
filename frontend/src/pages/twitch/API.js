import axios from 'axios';
import { getCookie } from '../../util';
import validateToken from './validateToken';

const CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

const TWITCH_INSTANCE = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  timeout: 5000,
});

const canUseAppToken = (config) => {
  if (config.url === '/games') return true;
  if (config.url === '/games/top') return true;
  if (config.url === '/clips') return true;
  if (config.url === '/videos') return true;
  if (config.url === '/users') return true;
  if (config.url === '/streams') return true;
  if (config.url.includes('/search')) return true;
  return false;
};

TWITCH_INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await validateToken(canUseAppToken(config));
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Client-ID'] = CLIENT_ID;

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

TWITCH_INSTANCE.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const pagination = async (response) => {
  if (response?.data?.pagination?.cursor) {
    const params = { ...response.config.params, after: response?.data?.pagination?.cursor };

    return [
      ...(response?.data?.data || []),
      ...((await TWITCH_INSTANCE.get(response.config.url, { params }))?.data?.data || []),
    ];
  }

  return response;
};

// const controller = new AbortController();

const TwitchAPI = {
  getMe: async ({ accessToken }) => {
    return await TWITCH_INSTANCE.get(`/users`, {});
  },

  getStreams: async (params) => {
    return await TWITCH_INSTANCE.get(`/streams`, {
      params,
    });
  },

  getFollowedStreams: async (params) => {
    return await TWITCH_INSTANCE.get(`/streams/followed`, {
      params,
    });
  },

  getVideos: async (params) => {
    return await TWITCH_INSTANCE.get(`/videos`, {
      params,
    });
  },

  getClips: async (params) => {
    return await TWITCH_INSTANCE.get(`/clips`, {
      params,
    });
  },

  postClip: async (params) => {
    return await TWITCH_INSTANCE.post(`/clips`, params, {});
  },

  getUser: async (params) => {
    return await TWITCH_INSTANCE.get(`/users`, {
      params,
    });
  },

  getSearchChannels: async (params, query) => {
    return await TWITCH_INSTANCE.get(`/search/channels?query=${encodeURI(query)}`, {
      params,
    });
  },

  getChannel: async (params) => {
    return await TWITCH_INSTANCE.get(`/channels`, {
      params,
    });
  },

  getMyFollowedChannels: async (params) => {
    return await TWITCH_INSTANCE.get(`/users/follows`, {
      params: { ...params, from_id: getCookie('Twitch-userId') },
    });
  },

  getFollowedChannels: async (params) => {
    return await TWITCH_INSTANCE.get(`/users/follows`, {
      params,
    });
  },

  getGames: async (params) => {
    return await TWITCH_INSTANCE.get(`/games`, {
      params,
    });
  },

  getSearchGames: async (params, query) => {
    return await TWITCH_INSTANCE.get(`/search/categories?query=${encodeURI(query) || ''}`, {
      params,
    });
  },

  getTopGames: async (params) => {
    return await TWITCH_INSTANCE.get(`/games/top`, {
      params,
    });
  },

  checkFollow: async (params) => {
    return await TWITCH_INSTANCE.get(`/users/follows`, {
      params,
    });
  },

  getTags: async (params) => {
    return await TWITCH_INSTANCE.get(`/streams/tags`, {
      params,
    }).catch((e) => console.error(e));
  },

  getAllTags: async (params, query) => {
    return await TWITCH_INSTANCE.get(`/tags/streams${query || ''}`, {
      params,
    }).catch((e) => console.error(e));
  },

  getSchedule: async (params) => {
    return await TWITCH_INSTANCE.get(`/schedule`, {
      params,
    }).catch((e) => {
      if (e?.response?.data?.status !== 404) {
        throw e;
      }
    });
  },
};
export default TwitchAPI;
