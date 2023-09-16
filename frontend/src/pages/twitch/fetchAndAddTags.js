import { chunk } from "../../utilities";
import TwitchAPI from "./API";

export const fetchAndAddTags = async ({ streams, tag_ids }) => {
	const tagsIds =
		tag_ids ||
		streams?.reduce((acc, curr) => {
			return [...acc, ...(curr?.tag_ids || [])];
		}, []);

	const uniqueTags = [...new Set(tagsIds)];
	const tagsChunked = chunk(uniqueTags, 100);

	const tags = tagsChunked?.reduce(async (acc, curr) => {
		const tagsQueryString = (curr?.length ? "?tag_id=" : "") + curr.join("&tag_id=");

		const fetchedTags = await TwitchAPI.getAllTags({}, tagsQueryString);
		return [...acc, ...(fetchedTags?.data?.data || [])];
	}, []);

	return tags;
};
