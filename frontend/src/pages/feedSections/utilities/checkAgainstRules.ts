import { loginNameFormat } from "../../../utilities";

const checkAgainstRules = (stream: StreamType, rules: any[], favorites: any[] = []) => {
	if (!rules) return stream;
	return rules?.some(
		(r: { title: string; category: string; channel: string; tag: string; viewers: number; favorited?: boolean | null | undefined }) => {
			const title = (!stream.title && !r.title) || stream.title?.toLowerCase().includes(r.title?.toLowerCase()?.trim());
			//game is not included in vods, so cant filter vods based on game
			//but if i have !stream.game_name, then rules with only a game will return true
			//ex. If i only have ASMR a game then vods with no game would return true and all vods will be shows..
			// (!stream.game_name && title) ||
			const game = (!stream.game_name && !r.category) || stream.game_name?.toLowerCase().includes(r.category?.toLowerCase()?.trim());
			const name = loginNameFormat(stream)?.toLowerCase()?.trim().includes(r.channel?.toLowerCase()?.trim());
			const tags =
				(!stream.tags && !r.tag) ||
				!stream?.tags?.length ||
				stream?.tags?.find((tag_name: string) => tag_name?.toLowerCase()?.includes(r?.tag?.toLowerCase()?.trim()));

			const viewer_count = stream.viewer_count >= r.viewers || stream.view_count >= r.viewers;

			const favorite = !r.favorited || favorites?.some?.((user_id) => String(user_id) === String(stream.user_id));

			// return title && (game || !stream.game_name) && name && tags && viewer_count;
			// If !stream.game_name = true but nothing else mathces, than it will falsly add stream to feed.
			// For examepl, Yuggie does not match ASMR feed section rules, and but since she have no game specified it will return true and she will be added to the ASMR feed
			return title && game && name && tags && viewer_count && favorite;
		}
	);
};

export default checkAgainstRules;
