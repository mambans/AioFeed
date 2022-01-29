import axios from 'axios';
import { getCookie } from '../../util';
import validateToken from './validateToken';

const CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
const BASE_URL = 'https://api.twitch.tv/helix';
const BASE_URL_KRAKEN = 'https://api.twitch.tv/kraken';

const TwitchAPI = {
  getMe: async ({ accessToken }) => {
    const token = accessToken || (await validateToken());
    return await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getStreams: async (params) => {
    return await axios.get(`${BASE_URL}/streams`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getVideos: async (params) => {
    return await axios.get(`${BASE_URL}/videos`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getClips: async (params) => {
    return await axios.get(`${BASE_URL}/clips`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  postClip: async (params) => {
    return await axios.post(`${BASE_URL}/clips`, params, {
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getUser: async (params) => {
    return await axios.get(`${BASE_URL}/users`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getSearchChannels: async (params, query) => {
    return await axios.get(`${BASE_URL}/search/channels?query=${encodeURI(query)}`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getChannel: async (params) => {
    return await axios.get(`${BASE_URL}/channels`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getMyFollowedChannels: async (params) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params: { ...params, from_id: getCookie('Twitch-userId') },
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getFollowedChannels: async (params) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getGames: async (params) => {
    return await axios.get(`${BASE_URL}/games`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getSearchGames: async (params, query) => {
    return await axios.get(`${BASE_URL}/search/categories?query=${encodeURI(query)}`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getTopGames: async (params) => {
    return await axios.get(`${BASE_URL}/games/top`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  krakenGetVideo: async (params) => {
    return await axios.get(`${BASE_URL_KRAKEN}/videos/${params.id}`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
        Accept: 'application/vnd.twitchtv.v5+json',
      },
    });
  },

  checkFollow: async (params) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  deleteFollow: async (params) => {
    return await axios.delete(`${BASE_URL}/users/follows`, {
      params,
      headers: {
        Authorization: `Bearer ${await validateToken()}`,
        'Content-Type': 'application/json',
        'Client-ID': CLIENT_ID,
      },
    });
  },

  addFollow: async (params) => {
    return await axios.post(
      `${BASE_URL}/users/follows`,
      {},
      {
        params,
        headers: {
          Authorization: `Bearer ${await validateToken()}`,
          'Content-Type': 'application/json',
          'Client-ID': CLIENT_ID,
        },
      }
    );
  },

  getTags: async (params) => {
    return await axios
      .get(`${BASE_URL}/streams/tags`, {
        params,
        headers: {
          Authorization: `Bearer ${await validateToken()}`,
          'Client-ID': CLIENT_ID,
        },
      })
      .catch((e) => console.error(e));
  },

  getAllTags: async (params, query) => {
    return await axios
      .get(`${BASE_URL}/tags/streams${query || ''}`, {
        params,
        headers: {
          Authorization: `Bearer ${await validateToken()}`,
          'Client-ID': CLIENT_ID,
        },
      })
      .catch((e) => console.error(e));
  },

  getSchedule: async (params, { skipValidation } = {}) => {
    return await axios
      .get(`${BASE_URL}/schedule`, {
        params,
        headers: {
          Authorization: `Bearer ${await validateToken(skipValidation)}`,
          'Client-ID': CLIENT_ID,
        },
      })
      .catch((e) => {
        if (e?.response?.data?.status !== 404) {
          console.error('fetchedSchedule error:', e);
        }
      });
  },
};
export default TwitchAPI;
