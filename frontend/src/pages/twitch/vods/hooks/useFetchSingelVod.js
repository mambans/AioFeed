import { useCallback } from "react";
import uniqBy from "lodash/uniqBy";
import { addVodEndTime } from "../../TwitchUtils";
import AddVideoExtraData from "../../AddVideoExtraData";
import SortAndAddExpire from "../SortAndAddExpire";
import TwitchAPI from "../../API";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { twitchVodsAtom, vodChannelsAtom } from "../atoms";
import { feedPreferencesAtom } from "../../../../atoms/atoms";

const useFetchSingelVod = () => {
	const { vods } = useRecoilValue(feedPreferencesAtom) || {};

	const setTwitchVods = useSetRecoilState(twitchVodsAtom);
	const channels = useRecoilValue(vodChannelsAtom);

	const vodExpire = 3; // Number of days

	const fetchLatestVod = useCallback(
		async ({ user_id, amount = 1, check = false } = {}) => {
			if (check && (!vods?.enabled || !channels?.includes(user_id))) return null;
			return await TwitchAPI.getVideos({
				user_id: user_id,
				period: "month",
				first: amount,
				type: "all",
			}).then(async (res) => {
				const newVodWithProfile = (await AddVideoExtraData({ items: res.data })) || [];
				const newVodWithEndtime = (await addVodEndTime(newVodWithProfile.data)) || [];

				setTwitchVods((vods = { data: [] }) => {
					const existingVods = vods?.data ? [...(vods?.data || [])] : [];
					const vodsToAdd = [
						...newVodWithEndtime.slice(0, amount).map((vod) => ({
							...vod,
							transition: "videoFadeSlide",
						})),
					];
					const uniqueVods = uniqBy([...(vodsToAdd || []), ...(existingVods || [])]?.slice(0, 100), "id");
					const FinallVods = SortAndAddExpire(uniqueVods, vodExpire, vods.loaded, vods.expire) || [];

					return FinallVods;
				});
			});
		},
		[channels, vods, setTwitchVods]
	);

	return { fetchLatestVod };
};
export default useFetchSingelVod;
