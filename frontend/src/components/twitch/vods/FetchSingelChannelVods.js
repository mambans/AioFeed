import { durationToDate } from './../TwitchUtils';
import AddVideoExtraData from './../AddVideoExtraData';
import SortAndAddExpire from './SortAndAddExpire';
import API from '../API';
import { getLocalstorage } from '../../../util/Utils';

export default async (channelId, setVods, status) => {
  const vodExpire = 3; // Number of days

  const addVodEndTime = async (followedStreamVods) => {
    return followedStreamVods.map((stream) => {
      if (stream.type === 'archive') {
        stream.endDate = durationToDate(stream.duration, stream.created_at);
      } else {
        stream.endDate = new Date(stream.created_at).getTime();
      }
      return stream;
    });
  };

  await API.getVideos({
    params: {
      user_id: channelId,
      period: 'month',
      first: 1,
      type: 'all',
    },
  }).then(async (res) => {
    const newVodWithProfile = await AddVideoExtraData({ items: res.data });
    const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

    if (status === 'offline') {
      const streams = getLocalstorage('newLiveStreamsFromPlayer') || { data: [] };
      const newStreams = streams.data.filter(
        (item) => item.user_name?.toLowerCase() !== res.data.data[0].user_name?.toLowerCase()
      );
      localStorage.setItem(
        'newLiveStreamsFromPlayer',
        JSON.stringify({ data: newStreams, updated: Date.now() })
      );
    }

    setVods((vods) => {
      const existingVods = [...vods.data];
      const vodToAdd = { ...newVodWithEndtime[0], transition: 'videoFadeSlide' };
      const objectToUpdateIndex = existingVods.findIndex((item) => {
        return item.id === vodToAdd.id;
      });

      existingVods.splice(objectToUpdateIndex, 1);
      existingVods.push(vodToAdd);

      const FinallVods = SortAndAddExpire(existingVods, vodExpire, vods.loaded, vods.expire);
      localStorage.setItem(`Vods`, JSON.stringify(FinallVods));

      return FinallVods;
    });
  });
};
