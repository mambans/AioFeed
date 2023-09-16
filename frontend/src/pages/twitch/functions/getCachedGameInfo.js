import { getLocalstorage } from "../../../utilities";

const getCachedGameInfo = ({ refresh } = { refresh: false }) => {
	const games = getLocalstorage("Twitch_game_details") || {};

	if (refresh || !games.expireDate || new Date(games.expireDate).getTime() < Date.now()) {
		return {
			expireDate: new Date(new Date().setDate(new Date().getDate() + 30)),
		};
	}

	return games;
};
export default getCachedGameInfo;
