import React from "react";
import Alert from "../../components/alert";
import { useSetNavigationSidebarVisible } from "../../stores/navigation";
import { useFeedPreferences } from "../../stores/feedPreference";

const NoFeedsEnabled = () => {
	const feedPreferences = useFeedPreferences();

	const { twitch, youtube, vods, mylists, twitter } = feedPreferences || {};
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();

	if (!twitch?.enabled && !youtube?.enabled && !vods?.enabled && !mylists?.enabled && !twitter?.enabled) {
		return (
			<Alert
				type="info"
				title="No feeds enabled"
				message="Enable feeds in the navigation sidebar on the right."
				onClick={() => setNavigationSidebarVisible(true)}
			/>
		);
	}
	return null;
};

export default NoFeedsEnabled;
