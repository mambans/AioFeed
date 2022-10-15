import { toast } from 'react-toastify';
import YoutubeAPI from '../API';
import { getLocalstorage, setLocalStorage } from './../../../util';

const unFollowChannel = async ({ subscriptionId, channelId, setChannels, videos, setVideos }) => {
  const followedChannels = getLocalstorage(`YT-followedChannels`) || [];
  const newFollowedChannels = followedChannels.data.filter(
    (channel) => channel.id !== subscriptionId
  );
  const newFilteredVideos = videos.filter((video) => video.snippet.channelId !== channelId);

  setChannels(newFollowedChannels);
  setVideos(newFilteredVideos);

  setLocalStorage(`YT-followedChannels`, {
    data: newFollowedChannels,
    casheExpire: followedChannels.casheExpire,
  });

  await YoutubeAPI.unFollow({
    id: subscriptionId,
  }).catch((er) => {
    console.error('er:', er);
    toast.error('Failed to unfollow channel');
  });
};

export default unFollowChannel;
