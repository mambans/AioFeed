import AddVideoExtraData from './../AddVideoExtraData';
import API from '../API';

function chunk(array, size) {
  const chunked_arr = [];
  let index = 0;
  while (index < array?.length) {
    chunked_arr.push(array?.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

const fetchAllOnlineStreams = async (followedChannelsIds) => {
  const channelsInChunks = chunk(followedChannelsIds, 100);
  const allOnlineStreams = await Promise.all(
    channelsInChunks.map(async (channelsChunk) => {
      return API.getStreams({
        params: {
          user_id: channelsChunk,
          first: 100,
        },
      })
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    })
  ).then((res) => {
    return res.flat(1);
  });

  return allOnlineStreams;
};

export default async function getFollowedOnlineStreams({
  followedchannels,
  disableNotifications,
  fetchGameInfo = true,
  fetchProfiles = true,
  previousStreams,
}) {
  let error;

  try {
    // Make an array of all followed channels id's for easier/less API reuqests.
    const followedChannelsIds = await followedchannels.map((channel) => {
      return channel.to_id || channel.user_id;
    });

    // Get all Live-streams from followed channels.
    const LiveFollowedStreams = {
      data: { data: await fetchAllOnlineStreams(followedChannelsIds) },
    };

    try {
      if (LiveFollowedStreams.data.data.length > 0) {
        const finallStreams =
          fetchGameInfo || fetchProfiles
            ? await AddVideoExtraData({
                items: LiveFollowedStreams.data,
                forceNewProfiles: disableNotifications,
                fetchGameInfo,
                fetchProfiles,
                previousStreams,
              })
            : LiveFollowedStreams.data;

        return {
          data: finallStreams.data,
          status: 200,
          error: error,
        };
      }
      return {
        data: [],
        status: 200,
        error: error,
      };
    } catch (e) {
      console.error(e);
      error = e;
      return { error: error, status: 201 };
    }
  } catch (error) {
    console.error(error.message);
    return error;
  }
}
