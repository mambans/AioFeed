import { TiFlashOutline, TiFlash } from "react-icons/ti";
import React, { useState, useContext, useEffect } from "react";
import { VodAddRemoveButton } from "../sharedComponents/sharedStyledComponents";
import ToolTip from "../../components/tooltip/ToolTip";
import API from "../navigation/API";
import { TwitchContext } from "./useToken";
import loginNameFormat from "./loginNameFormat";

export const removeChannel = async ({ user_id, updateNotischannels, setUpdateNotischannels }) => {
	try {
		const channelsSets = new Set(updateNotischannels || []);
		if (channelsSets.has(user_id)) {
			channelsSets.delete(user_id);
			const newChannels = [...channelsSets];

			setUpdateNotischannels(newChannels);

			await API.addUdateChannels(newChannels);
		}
	} catch (e) {
		console.log(e.message);
	}
};

/**
 * @param {Object} channel - channel obj
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Number} [size=24] - size of the Icons/Svgs;
 */

const AddUpdateNotificationsButton = ({ channel, loweropacity, marginright, size = "1.4em", show = true }) => {
	const { updateNotischannels, setUpdateNotischannels } = useContext(TwitchContext);
	const [enabled, setEnabled] = useState(updateNotischannels?.includes(channel?.user_id));

	async function addChannel() {
		try {
			const existing = new Set(updateNotischannels || []);
			const newChannels = [...existing.add(channel?.user_id)];

			setUpdateNotischannels(newChannels);

			await API.addUdateChannels(newChannels);
		} catch (error) {
			console.log("error", error);
		}
	}

	useEffect(() => {
		setEnabled(updateNotischannels?.includes(channel?.user_id));
	}, [updateNotischannels, channel]);

	const handleOnClick = () => {
		setEnabled((c) => !c);
		setTimeout(() => {
			if (enabled) {
				// unfollowStream();
				removeChannel({
					user_id: channel?.user_id,
					updateNotischannels,
					setUpdateNotischannels,
				});
			} else {
				addChannel();
			}
		}, 0);
	};

	if (!show) return null;

	return (
		<ToolTip
			delay={{ show: 500, hide: 0 }}
			width="max-content"
			tooltip={`${enabled ? "Disable" : "Enable"}${loginNameFormat(channel)} stream title/game update notification`}
		>
			<VodAddRemoveButton
				className="StreamUpdateNoitificationsButton"
				marginright={marginright}
				loweropacity={loweropacity}
				vodenabled={String(enabled)}
				variant="link"
				onClick={handleOnClick}
			>
				{enabled ? <TiFlash size={size} color="green" /> : <TiFlashOutline size={size} />}
			</VodAddRemoveButton>
		</ToolTip>
	);
};
export default AddUpdateNotificationsButton;
