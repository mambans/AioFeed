import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";

import GetVideoInfo from "./GetVideoInfo";
import { getCookie, getLocalstorage, setLocalStorage } from "./../../utilities";
import YoutubeAPI from "./API";

const filterTypeUpload = async (response) => {
	if (Boolean(response?.items?.length)) {
		return response.items.filter((video) => video?.snippet?.type === "upload") || [];
	}
	return [];
};

const fetchSubscriptionVideos = async (videosCACHE, channel) => {
	const currentDate = new Date();
	const DATE_THRESHOLD = new Date(currentDate.setDate(currentDate.getDate() - 7));

	const checkForCachedChannel = () =>
		videosCACHE.find((cacheChannel) => cacheChannel?.channel?.snippet?.resourceId?.channelId === channel?.snippet?.resourceId?.channelId);
	const cachedChannelObj = checkForCachedChannel();
	const staticHeaders = {
		Authorization: `Bearer ${getCookie("Youtube-access_token")}`,
		Accept: "application/json",
	};
	const headers = cachedChannelObj
		? {
				"If-None-Match": cachedChannelObj.channel.etag,
				...staticHeaders,
		  }
		: { ...staticHeaders };

	const res = await YoutubeAPI.getActivities(
		{
			part: "snippet,contentDetails",
			channelId: channel?.snippet?.resourceId?.channelId,
			maxResults: 10,
			publishedAfter: DATE_THRESHOLD.toISOString(),
		},
		headers
	)
		.then((result) => ({ channels: result.data }))
		.catch((e) => ({ channels: cachedChannelObj || null, error: e }));
	return res;
};

const getSubscriptionVideos = async (followedChannels) => {
	let error = null;

	try {
		const videosCACHE = getLocalstorage("YT-ChannelsObj") || [];

		const channelWithVideos = await Promise.all(
			followedChannels.map(
				async (channel) =>
					await fetchSubscriptionVideos(videosCACHE, channel).then(async (result) => {
						error = result.error;
						const items = await filterTypeUpload(result.channels);

						return { channel, items };
					})
			)
		);

		const videoImageUrls = (vid) => vid?.maxres?.url || vid?.standard?.url || vid?.high?.url || vid?.medium?.url || vid?.default.url;

		const localStorageObjetToSave = channelWithVideos.slice(-50).map((obj) => {
			return {
				...obj,
				items: obj.items.map((video) => {
					const snippet = {
						...video.snippet,
						thumbnails: [videoImageUrls(video.snippet.thumbnails)],
					};
					delete snippet.description;

					return { ...video, snippet };
				}),
			};
		});

		setLocalStorage("YT-ChannelsObj", localStorageObjetToSave);

		const videoOnlyArray = channelWithVideos.map((channel) => (Array.isArray(channel.items) ? channel.items : null));

		const flattedVideosArray = videoOnlyArray.flat(1).filter((items) => items);

		const videosWithDetails = await GetVideoInfo({ videos: flattedVideosArray });

		const sortedVideos = reverse(sortBy(videosWithDetails, (video) => video?.snippet?.publishedAt)).filter((i) => i);

		return { data: sortedVideos, error: error };
	} catch (error) {
		console.error(error);
		return error;
	}
};

export default getSubscriptionVideos;
