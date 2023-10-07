import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";

import addProfileInfo from "../../../pages/twitch/functions/addProfileInfo";
import addGameInfo from "../../../pages/twitch/functions/addGameInfo";

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

		const uniqueStreams = uniqBy(streamsWithGame, "user_id");

		const orderedStreams = orderBy(uniqueStreams, (s) => s.viewer_count, "desc");

		return orderedStreams;
	}

	throw new Error("Streams is not an array");
};

export default decorateStreams;
