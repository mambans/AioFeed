import { useCallback, useContext } from 'react';
import VodsContext from '../VodsContext';
import uniqBy from 'lodash/uniqBy';
import { addVodEndTime } from '../../TwitchUtils';
import AddVideoExtraData from '../../AddVideoExtraData';
import SortAndAddExpire from '../SortAndAddExpire';
import TwitchAPI from '../../API';

const useFetchSingelVod = () => {
  const { setVods, vods, enableTwitchVods, channels } = useContext(VodsContext) || {};
  const vodExpire = 3; // Number of days

  const fetchLatestVod = useCallback(
    async ({ user_id, amount = 1, check = false } = {}) => {
      console.log('fetchLatestVod:');
      if (check && (!enableTwitchVods || !channels?.includes(user_id))) return null;
      console.log(`Fetching singel vod for ${user_id}`);
      return await TwitchAPI.getVideos({
        user_id: user_id,
        period: 'month',
        first: amount,
        type: 'all',
      }).then(async (res) => {
        const newVodWithProfile = (await AddVideoExtraData({ items: res.data })) || [];
        const newVodWithEndtime = (await addVodEndTime(newVodWithProfile.data)) || [];

        if (setVods)
          setVods((vods = { data: [] }) => {
            const existingVods = vods?.data ? [...vods?.data] : [];
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
            const FinallVods =
              SortAndAddExpire(uniqueVods, vodExpire, vods.loaded, vods.expire) || [];

            return FinallVods;
          });
      });
    },
    [channels, enableTwitchVods, setVods]
  );

  return { vods, fetchLatestVod };
};
export default useFetchSingelVod;
