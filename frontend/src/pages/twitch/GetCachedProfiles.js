import { getLocalstorage } from "../../utilities";

const getCachedProfiles = ({ refresh } = { refresh: false }) => {
	const profiles = getLocalstorage("TwitchProfiles") || {};

	if (refresh || !profiles.expireDate || new Date(profiles.expireDate).getTime() < Date.now()) {
		return {
			expireDate: new Date(new Date().setDate(new Date().getDate() + 7)),
		};
	}

	return profiles;
};
export default getCachedProfiles;
