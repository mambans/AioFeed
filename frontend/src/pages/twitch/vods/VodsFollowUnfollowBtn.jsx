import { MdVideoCall, MdVideocam } from "react-icons/md";

import React, { useState, useEffect } from "react";

import { VodAddRemoveButton } from "../../sharedComponents/sharedStyledComponents";
import ToolTip from "../../../components/tooltip/ToolTip";
import loginNameFormat from "../loginNameFormat";
import { useVodsAddVodChannel, useVodsChannels, useVodsFetchChannelVods, useVodsRemoveChannel } from "../../../stores/twitch/vods";
import { useFeedPreferences } from "../../../stores/feedPreference";

/**
 * @param {Object} channel - channel
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Boolean} [show = true] - mount/show button.
 */

const VodsFollowUnfollowBtn = ({ channel, loweropacity, marginright, className, show = true, size = "1.4em", text, type = "link", padding }) => {
	const channels = useVodsChannels();
	const [enabled, setEnabled] = useState(channels && !!channels?.find?.((user_id) => channel?.user_id === user_id));
	const feedPreferences = useFeedPreferences();

	const { vods } = feedPreferences || {};

	const addVodChannel = useVodsAddVodChannel();
	const removeChannel = useVodsRemoveChannel();
	const fetchChannelVods = useVodsFetchChannelVods();

	const handleOnClick = (e) => {
		e.preventDefault();
		setEnabled((c) => !c);
		setTimeout(() => {
			if (enabled) {
				// unfollowStream();
				if (removeChannel) removeChannel({ channel });
			} else {
				if (addVodChannel) addVodChannel({ channel });
				if (channel?.user_id) {
					fetchChannelVods({ user_id: channel.user_id, amount: 5 });
				}
			}
		}, 0);
	};

	useEffect(() => {
		setEnabled(!!channels?.find?.((user_id) => channel?.user_id === user_id));
	}, [channels, channel?.user_id]);

	if ((!show && !vods?.enabled) || !channel) return null;

	return (
		<ToolTip delay={{ show: 500, hide: 0 }} tooltip={`${enabled ? "Disable" : "Enable"} ${loginNameFormat(channel)} vods`} width="max-content">
			<VodAddRemoveButton
				className={`VodButton ${className || ""}`}
				marginright={marginright}
				loweropacity={loweropacity}
				vodenabled={String(enabled)}
				variant={type}
				padding={padding}
				onClick={handleOnClick}
			>
				<>
					{enabled ? <MdVideocam size={size} /> : <MdVideoCall size={size} />}
					{text}
				</>
			</VodAddRemoveButton>
		</ToolTip>
	);
};
export default VodsFollowUnfollowBtn;
