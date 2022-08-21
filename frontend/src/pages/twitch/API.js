import axios from 'axios';
import { getCookie } from '../../util';
import validateToken from './validateToken';

const CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

const INSTANCE = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  timeout: 5000,
});

INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await validateToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Client-ID'] = CLIENT_ID;

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// const controller = new AbortController();

const TwitchAPI = {
  getMe: async ({ accessToken }) => {
    return await INSTANCE.get(`/users`, {});
  },

  getStreams: async (params) => {
    return await INSTANCE.get(`/streams`, {
      params,
    });
  },

  getFollowedStreams: async (params) => {
    return await INSTANCE.get(`/streams/followed`, {
      params,
    });
  },

  getVideos: async (params) => {
    return await INSTANCE.get(`/videos`, {
      params,
    });
  },

  getClips: async (params) => {
    return await INSTANCE.get(`/clips`, {
      params,
    });
  },

  postClip: async (params) => {
    return await INSTANCE.post(`/clips`, params, {});
  },

  getUser: async (params) => {
    return await INSTANCE.get(`/users`, {
      params,
    });
  },

  getSearchChannels: async (params, query) => {
    return await INSTANCE.get(`/search/channels?query=${encodeURI(query)}`, {
      params,
    });
  },

  getChannel: async (params) => {
    return await INSTANCE.get(`/channels`, {
      params,
    });
  },

  getMyFollowedChannels: async (params) => {
    return await INSTANCE.get(`/users/follows`, {
      params: { ...params, from_id: getCookie('Twitch-userId') },
    });
  },

  getFollowedChannels: async (params) => {
    return await INSTANCE.get(`/users/follows`, {
      params,
    });
  },

  getGames: async (params) => {
    return await INSTANCE.get(`/games`, {
      params,
    });
  },

  getSearchGames: async (params, query) => {
    return await INSTANCE.get(`/search/categories?query=${encodeURI(query) || ''}`, {
      params,
    });
  },

  getTopGames: async (params) => {
    return await INSTANCE.get(`/games/top`, {
      params,
    });
  },

  checkFollow: async (params) => {
    return await INSTANCE.get(`/users/follows`, {
      params,
    });
  },

  getTags: async (params) => {
    return await INSTANCE.get(`/streams/tags`, {
      params,
    }).catch((e) => console.error(e));
  },

  getAllTags: async (params, query) => {
    return await INSTANCE.get(`/tags/streams${query || ''}`, {
      params,
    }).catch((e) => console.error(e));
  },

  getSchedule: async (params) => {
    return await INSTANCE.get(`/schedule`, {
      params,
    }).catch((e) => {
      if (e?.response?.data?.status !== 404) {
        throw e;
      }
    });
  },
};
export default TwitchAPI;
