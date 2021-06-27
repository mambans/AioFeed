import { uniqBy } from 'lodash';

import { addVodEndTime } from './../TwitchUtils';
import AddVideoExtraData from './../AddVideoExtraData';
import SortAndAddExpire from './SortAndAddExpire';
import API from '../API';

const fetchSingelChannelVods = async ({
  channelId,
  setVods,
  amount = 1,
  feedVideoSizeProps = {},
}) => {
  const vodExpire = 3; // Number of days

  await API.getVideos({
    params: {
      user_id: channelId,
      period: 'month',
      first: amount,
      type: 'all',
    },
  }).then(async (res) => {
    const newVodWithProfile = await AddVideoExtraData({ items: res.data });
    const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

    setVods((vods) => {
      const existingVods = [...vods.data];
      const vodsToAdd = [
        ...newVodWithEndtime.slice(0, amount).map((vod) => ({
          ...vod,
          transition: feedVideoSizeProps.transition || 'videoFadeSlide',
        })),
      ];
      const uniqueVods = uniqBy([...vodsToAdd, ...existingVods], 'id');
      const FinallVods = SortAndAddExpire(uniqueVods, vodExpire, vods.loaded, vods.expire);

      return FinallVods;
    });
  });
};
export default fetchSingelChannelVods;
