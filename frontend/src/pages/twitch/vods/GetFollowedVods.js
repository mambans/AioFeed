import AddVideoExtraData from '../AddVideoExtraData';
import TwitchAPI from '../API';
import { addVodEndTime } from '../TwitchUtils';
import SortAndAddExpire from './SortAndAddExpire';

const fetchVodsFromMonitoredChannels = async (vodChannels) => {
  const PromiseAllVods = await Promise.allSettled(
    vodChannels.map(
      async (channelId) =>
        await TwitchAPI.getVideos({
          user_id: channelId,
          period: 'month',
          first: 5,
          type: 'all',
        }).then((response) => response.data.data)
    )
  );

  return PromiseAllVods.flatMap((promise) => promise?.value || []);
};

const getFollowedVods = async ({ forceRun, channels, currentVods }) => {
  const vodExpire = 3; // Number of hours
  // const cachedVods = getLocalstorage(`Vods`);
  const cachedVods = currentVods;

  try {
    if (
      forceRun ||
      !cachedVods ||
      !cachedVods.data ||
      !Object.values(cachedVods.data).length ||
      cachedVods.expire <= Date.now()
    ) {
      try {
        const vodChannels = channels;
        if (!vodChannels || !Boolean(vodChannels.length)) {
          return {
            error: {
              data: {
                title: 'No monitored vod channels.',
                message: 'You have not added any Twitch channels to fetch vods from yet.',
              },
            },
          };
        }

        const followedStreamVods = await fetchVodsFromMonitoredChannels(vodChannels);

        const videos = await AddVideoExtraData({
          items: {
            data: followedStreamVods,
          },
        });

        const videoWithEndTime = await addVodEndTime(videos.data);

        const followedOrderedStreamVods = SortAndAddExpire(videoWithEndTime, vodExpire);

        return {
          data: followedOrderedStreamVods || [],
        };
      } catch (er) {
        return {
          data: cachedVods,
          er,
        };
      }
    }

    return { data: cachedVods };
  } catch (er) {
    console.error('message: ', er.message);
    return {
      data: cachedVods,
      er,
    };
  }
};
export default getFollowedVods;
