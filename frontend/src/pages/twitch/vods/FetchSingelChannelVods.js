import uniqBy from "lodash/uniqBy";

import { addVodEndTime } from "../TwitchUtils";
import AddVideoExtraData from "../AddVideoExtraData";
import SortAndAddExpire from "./SortAndAddExpire";
import TwitchAPI from "../API";

//Delete? Now replaced by hook useFetchSingelVod
const fetchSingelChannelVods = async ({ user_id, setVods, amount = 1 }) => {
	const vodExpire = 3; // Number of days

	await TwitchAPI.getVideos({
		user_id: user_id,
		period: "month",
		first: amount,
		type: "all",
	}).then(async (res) => {
		const newVodWithProfile = await AddVideoExtraData({ items: res.data });
		const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

		setVods((vods = { data: [] }) => {
			const existingVods = [...(vods?.data || [])];
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
};
export default fetchSingelChannelVods;
