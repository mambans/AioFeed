import API from './API';

const fetchNextPageOfFollowers = async ({ total, PagePagination, followedchannels }) => {
  if (followedchannels?.length < total && PagePagination) {
    const nextPage = await API.getMyFollowedChannels({
      params: {
        first: 100,
        after: PagePagination,
      },
    }).catch((error) => {
      console.log(error);
    });

    const channels = [...followedchannels, ...nextPage.data.data];

    if (channels?.length < total) {
      return await fetchNextPageOfFollowers({
        total: total,
        PagePagination: nextPage.data.pagination.cursor,
        followedchannels: channels,
      });
    }
    return channels;
  }
  return followedchannels;
};

const getMyFollowedChannels = async () => {
  try {
    const followedchannels = await API.getMyFollowedChannels({
      params: {
        first: 100,
      },
    }).catch((error) => {
      console.error(error.message);
      return error;
    });

    const channels = await fetchNextPageOfFollowers({
      total: followedchannels?.data?.total,
      PagePagination: followedchannels?.data?.pagination.cursor,
      followedchannels: followedchannels?.data?.data,
    });

    return channels;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};
export default getMyFollowedChannels;
