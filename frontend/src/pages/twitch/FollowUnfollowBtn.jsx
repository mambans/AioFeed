/* eslint-disable no-unreachable */
import React, { useEffect, useState, useContext } from "react";

import { FollowBtn, UnfollowBtn } from "./StyledComponents";
import TwitchAPI from "./API";
import useToken, { TwitchContext } from "./useToken";
import ToolTip from "../../components/tooltip/ToolTip";
import { removeChannel as remmoveUpdateChannel } from "./AddUpdateNotificationsButton";
import UnsubscribeVodsPopupConfirm from "./UnsubscribeVodsPopupConfirm";
import { useVodsChannels } from "../../stores/twitch/vods";

const FollowUnfollowBtn = ({ channelName, id, size = "1.4em", style, refreshStreams, refreshAfterUnfollowTimer, followingStatus, show = true }) => {
	const [following, setFollowing] = useState(followingStatus);
	const [showUnsubscribeVods, setShowUnsubscribeVods] = useState();
	const channels = useVodsChannels();

	const { twitchUserId, setUpdateNotischannels, updateNotischannels } = useContext(TwitchContext);

	const validateToken = useToken();

	const unfollowStream = async () => {
		await validateToken().then(async () => {
			await TwitchAPI.deleteFollow({
				from_id: twitchUserId,
				to_id: id,
			})
				.then((res) => {
					if (res.status === 204) {
						console.log(`Unfollowed: ${channelName}`);
						remmoveUpdateChannel({
							channel: channelName,
							updateNotischannels,
							setUpdateNotischannels,
						});
						if (refreshStreams) {
							clearTimeout(refreshAfterUnfollowTimer.current);
							refreshAfterUnfollowTimer.current = setTimeout(() => {
								refreshStreams();
							}, 3000);
						}
					}
				})
				.catch((er) => console.error("unfollowStream -> er", er));
		});
	};

	async function followStream() {
		await validateToken().then(async () => {
			await TwitchAPI.addFollow({
				from_id: twitchUserId,
				to_id: id || (await TwitchAPI.getUser({ login: channelName })).data.data[0].id,
			})
				.then((res) => {
					if (res.status === 204) {
						console.log(`Followed: ${channelName}`);
						if (refreshStreams) refreshStreams();
					}
				})
				.catch((er) => console.error("followStream -> er", er));
		});
	}

	useEffect(() => {
		const checkFollowing = async () => {
			await validateToken().then(async () => {
				await TwitchAPI.checkFollow({ from_id: twitchUserId, to_id: id })
					.then((res) => {
						if (res.data.data[0]) {
							setFollowing(true);
						} else {
							console.log(`-Not following ${channelName}`);
						}
					})
					.catch((error) => {
						if (error.response?.data.message === "Follow not found") {
							console.log(`Not following ${channelName}`);
							setFollowing(false);
						} else {
							console.error(error);
						}
					});
			});
		};

		if (show && followingStatus === undefined) checkFollowing();
	}, [channelName, twitchUserId, id, followingStatus, show, validateToken]);

	return null;

	if (!show) return null;

	return (
		<ToolTip
			key={channelName + "followBtnTooltip"}
			placement={"bottom"}
			delay={{ show: 500, hide: 0 }}
			tooltip={`${following ? "Unfollow" : "Follow"} ${channelName || id}`}
			width="max-content"
		>
			<>
				{following ? (
					<UnfollowBtn
						className="StreamFollowBtn"
						size={size || 30}
						style={{ ...style }}
						onClick={() => {
							if (!channels?.includes(id)) {
								setFollowing(false);
								unfollowStream();
								return;
							}
							setShowUnsubscribeVods(true);
						}}
					/>
				) : (
					<FollowBtn
						className="StreamFollowBtn"
						size={size || 30}
						style={{ ...style }}
						onClick={() => {
							setFollowing(true);
							followStream();
						}}
					/>
				)}

				<UnsubscribeVodsPopupConfirm
					show={showUnsubscribeVods}
					setShowUnsubscribeVods={setShowUnsubscribeVods}
					channel={channelName}
					unfollowStream={unfollowStream}
				/>
			</>
		</ToolTip>
	);
};
export default FollowUnfollowBtn;
