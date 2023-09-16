import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";

import addProfileInfo from "src/pages/twitch/functions/addProfileInfo";
import addGameInfo from "src/pages/twitch/functions/addGameInfo";

const decorateStreams = async (streams: BaseStream[], refreshMetadata = false) => {
	if (Array.isArray(streams)) {
		const streamsWithProfiles = await addProfileInfo({
			items: streams,
			save: true,
			refresh: refreshMetadata,
			// signal: controller.current?.signal,
		});
		const streamsWithGame = await addGameInfo({
			items: streamsWithProfiles,
			save: true,
			refresh: refreshMetadata,
			// signal: controller.current?.signal,
		});
		const uniqueFilteredLiveStreams = uniqBy(streamsWithGame, "user_id");

		const recentLiveStreams = (uniqueFilteredLiveStreams || []).filter(
			(s = {}) => Math.trunc((Date.now() - new Date(s?.started_at).getTime()) / 1000) <= 150
		);

		const uniqueStreams = uniqBy([...(uniqueFilteredLiveStreams || []), ...(recentLiveStreams || [])], "id");

		// const streamsWithTags = uniqueStreams?.map((stream = {}) => {
		// 	const streams_tags = stream?.tag_ids?.map((id) => {
		// 		return tags?.find(({ tag_id } = {}) => tag_id === id);
		// 	});
		// 	const tag_names = streams_tags?.map((tag) => tag?.localization_names?.["en-us"]);

		// 	return { ...stream, tag_names, tags: streams_tags };
		// });

		const orderedStreams = orderBy(uniqueStreams, (s) => s.viewer_count, "desc");

		return { error: null, decoratedStreams: orderedStreams };
	}

	return { error: "errorrrrr", decoratedStreams: [] };
};

export default decorateStreams;
