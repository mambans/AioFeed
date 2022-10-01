import { useCallback, useContext } from 'react';
import VodsContext from '../VodsContext';
import uniqBy from 'lodash/uniqBy';
import { addVodEndTime } from '../../TwitchUtils';
import AddVideoExtraData from '../../AddVideoExtraData';
import SortAndAddExpire from '../SortAndAddExpire';
import TwitchAPI from '../../API';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { twitchVodsAtom, vodChannelsAtom } from '../atoms';

const useFetchSingelVod = () => {
  const { enableTwitchVods } = useContext(VodsContext) || {};

  const setTwitchVods = useSetRecoilState(twitchVodsAtom);
  const channels = useRecoilValue(vodChannelsAtom);

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
        console.log(' res.data:', res.data);
        const newVodWithProfile = (await AddVideoExtraData({ items: res.data })) || [];
        console.log('newVodWithProfile:', newVodWithProfile);
        const newVodWithEndtime = (await addVodEndTime(newVodWithProfile.data)) || [];
        console.log('newVodWithEndtime:', newVodWithEndtime);

        setTwitchVods((vods = { data: [] }) => {
          const existingVods = vods?.data ? [...vods?.data] : [];
          const vodsToAdd = [
            ...newVodWithEndtime.slice(0, amount).map((vod) => ({
              ...vod,
              transition: 'videoFadeSlide',
            })),
          ];
          console.log('vodsToAdd:', vodsToAdd);
          const uniqueVods = uniqBy(
            [...(vodsToAdd || []), ...(existingVods || [])]?.slice(0, 100),
            'id'
          );
          const FinallVods =
            SortAndAddExpire(uniqueVods, vodExpire, vods.loaded, vods.expire) || [];
          console.log('FinallVods:', FinallVods);

          return FinallVods;
        });
      });
    },
    [channels, enableTwitchVods, setTwitchVods]
  );

  return { fetchLatestVod };
};
export default useFetchSingelVod;
