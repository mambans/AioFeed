import { chunk } from "../../../utilities";
import TwitchAPI from "../API";
import getCachedProfiles from "../GetCachedProfiles";
import { isCancel } from "axios";

const addProfileInfo = async ({ save, refresh, items = [], cancelToken } = {}) => {
	const cached = getCachedProfiles({ refresh });

	const nonCached = items.reduce((acc, i) => {
		if (cached[i.user_id || i.broadcaster_id || i.to_id]) return acc;
		return [...acc, i.user_id || i.broadcaster_id || i.to_id];
	}, []);

	const nonCachedChunked = chunk(nonCached, 100);

	const newUsers = nonCached?.length
		? await Promise.all(
				nonCachedChunked.map(async (array) => {
					return await TwitchAPI.getUser({ id: array, cancelToken })
						.then((res) => res?.data?.data)
						.catch((e) => {
							if (isCancel(e)) {
								console.log("get games axios cancled");
							}
							return [];
						});
				})
		  ).then((res) => res.flat())
		: [];

	const newCache = {
		...cached,
		...newUsers.reduce((acc, i) => {
			acc[i.id] = { profile_image: i.profile_image_url, login: i.login, id: i.id };

			return acc;
		}, {}),
		expireDate: cached?.expireDate,
	};

	if (save) localStorage.setItem("TwitchProfiles", JSON.stringify(newCache));

	const newItemsWithProfile = items.map((i) => {
		return {
			...i,
			profile_image_url: i.profile_image_url || newCache[i.user_id || i.broadcaster_id || i.to_id]?.profile_image,
			login: i.login || newCache[i.user_id || i.broadcaster_id || i.to_id]?.login,
			user_name: i.user_name || newCache[i.user_id || i.broadcaster_id || i.to_id]?.login,
			id: i.id || i.user_id || i.broadcaster_id || i.to_id,
		};
	});

	return newItemsWithProfile;
};

export default addProfileInfo;
