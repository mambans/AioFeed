import { getCookie } from '../../../util';
import TwitchAPI from '../API';
import addSystemNotification from '../live/addSystemNotification';

const fetchMyFollowedLiveStreams = async ({ user_id = getCookie('Twitch-userId') }) => {
  const streams = await fetch({ user_id });
  return streams;
};

const fetch = async ({ user_id, pagination, previousStreams = [] }) => {
  return await TwitchAPI.getFollowedStreams({
    user_id,
    first: 100,
    after: pagination?.cursor,
  })
    .then(async (res) => {
      const streams = [...previousStreams, ...res.data.data];
      if (res.data?.pagination?.cursor) {
        return await fetch({ user_id, previousStreams: streams, pagination: res.data.pagination });
      }
      return streams;
    })
    .catch((e) => {
      if (e.response.data.status) {
        addSystemNotification({
          title: 'Error fetching followed streams',
          body: `${e.response.data.status} - ${e.response.data.message}`,
        });
      }
      return e.response.data;
    });
};

export default fetchMyFollowedLiveStreams;
