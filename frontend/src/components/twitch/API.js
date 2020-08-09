import axios from 'axios';
import { getCookie } from '../../util/Utils';

const CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
const BASE_URL = 'https://api.twitch.tv/helix';
const BASE_URL_KRAKEN = 'https://api.twitch.tv/kraken';

export default {
  getMe: async ({ accessToken = getCookie('Twitch-access_token') }) => {
    return await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getStreams: async ({ params }) => {
    return await axios.get(`${BASE_URL}/streams`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getVideos: async ({ params }) => {
    return await axios.get(`${BASE_URL}/videos`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getClips: async ({ params }) => {
    return await axios.get(`${BASE_URL}/clips`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  postClip: async ({ params }) => {
    return await axios.post(`${BASE_URL}/clips`, params, {
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getUser: async ({ params, throwError = true }) => {
    return await axios.get(`${BASE_URL}/users`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getSearchChannels: async ({ params, query, throwError = true }) => {
    return await axios.get(`${BASE_URL}/search/channels?query=${encodeURI(query)}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getChannel: async ({ params, throwError = true }) => {
    return await axios.get(`${BASE_URL}/channels`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getMyFollowedChannels: async ({ params }) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params: { ...params, from_id: getCookie('Twitch-userId') },
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getFollowedChannels: async ({ params }) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getGames: async ({ params }) => {
    return await axios.get(`${BASE_URL}/games`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getSearchGames: async ({ params, query, throwError = true }) => {
    return await axios.get(`${BASE_URL}/search/categories?query=${encodeURI(query)}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  getTopGames: async ({ params }) => {
    return await axios.get(`${BASE_URL}/games/top`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  krakenGetVideo: async ({ params }) => {
    return await axios.get(`${BASE_URL_KRAKEN}/videos/${params.id}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
        Accept: 'application/vnd.twitchtv.v5+json',
      },
    });
  },

  krakenGetChannelInfo: async ({ params }) => {
    return await axios.get(`${BASE_URL_KRAKEN}/channels/${params.id}`, {
      params: params,
      headers: {
        Authorization: `OAuth ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
        Accept: 'application/vnd.twitchtv.v5+json',
      },
    });
  },

  // checkFollowKRAKEN: async ({ params }) => {
  //   return await axios.get(
  //     `${BASE_URL_KRAKEN}/users/${params.myId}/follows/channels/${params.id}`,
  //     {
  //       params: params,
  //       headers: {
  //         Authorization: `OAuth ${getCookie('Twitch-access_token')}`,
  //         'Client-ID': CLIENT_ID,
  //         Accept: 'application/vnd.twitchtv.v5+json',
  //       },
  //     }
  //   );
  // },
  // -X GET 'https://api.twitch.tv/helix/users/follows?to_id=23161357'
  checkFollow: async ({ params }) => {
    return await axios.get(`${BASE_URL}/users/follows`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Client-ID': CLIENT_ID,
      },
    });
  },

  // deleteFollowKRAKEN: async ({ params }) => {
  //   return await axios.delete(
  //     `${BASE_URL_KRAKEN}/users/${params.myId}/follows/channels/${params.id}`,
  //     {
  //       params: params,
  //       headers: {
  //         Authorization: `OAuth ${getCookie('Twitch-access_token')}`,
  //         'Client-ID': CLIENT_ID,
  //         Accept: 'application/vnd.twitchtv.v5+json',
  //       },
  //     }
  //   );
  // },
  deleteFollow: async ({ params }) => {
    return await axios.delete(`${BASE_URL}/users/follows`, {
      params: params,
      headers: {
        Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
        'Content-Type': 'application/json',
        'Client-ID': CLIENT_ID,
      },
    });
  },

  // addFollowKRAKEN: async ({ params }) => {
  //   return await axios.put(
  //     `${BASE_URL_KRAKEN}/users/${params.myId}/follows/channels/${params.id}`,
  //     {},
  //     {
  //       params: params,
  //       headers: {
  //         Authorization: `OAuth ${getCookie('Twitch-access_token')}`,
  //         'Client-ID': CLIENT_ID,
  //         Accept: 'application/vnd.twitchtv.v5+json',
  //       },
  //     }
  //   );
  // },
  addFollow: async ({ params }) => {
    return await axios.post(
      `${BASE_URL}/users/follows`,
      {},
      {
        params: params,
        headers: {
          Authorization: `Bearer ${getCookie('Twitch-access_token')}`,
          'Content-Type': 'application/json',
          'Client-ID': CLIENT_ID,
        },
      }
    );
  },
};
