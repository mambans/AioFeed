import { useContext } from 'react';
import VodsContext from '../VodsContext';
import uniqBy from 'lodash/uniqBy';
import { addVodEndTime } from '../../TwitchUtils';
import AddVideoExtraData from '../../AddVideoExtraData';
import SortAndAddExpire from '../SortAndAddExpire';
import TwitchAPI from '../../API';

const useFetchSingelVod = () => {
  const { setVods, vods, enableTwitchVods, channels } = useContext(VodsContext);

  const vodExpire = 3; // Number of days

  const fetchLatestVod = async ({ user_id, amount = 1, check = false }) => {
    if (check && (!enableTwitchVods || !channels?.includes(user_id))) return null;
    return await TwitchAPI.getVideos({
      user_id: user_id,
      period: 'month',
      first: amount,
      type: 'all',
    }).then(async (res) => {
      const newVodWithProfile = await AddVideoExtraData({ items: res.data });
      const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

      setVods((vods = { data: [] }) => {
        const existingVods = [...vods?.data];
        const vodsToAdd = [
          ...newVodWithEndtime.slice(0, amount).map((vod) => ({
            ...vod,
            transition: 'videoFadeSlide',
          })),
        ];
        const uniqueVods = uniqBy(
          [...(vodsToAdd || []), ...(existingVods || [])]?.slice(0, 100),
          'id'
        );
        const FinallVods = SortAndAddExpire(uniqueVods, vodExpire, vods.loaded, vods.expire) || [];

        return FinallVods;
      });
    });
  };

  return { vods, fetchLatestVod };
};
export default useFetchSingelVod;
