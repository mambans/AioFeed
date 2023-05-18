import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ChannelPage from "./../twitch/channelPage";
import NoMatch from "../routes/NoMatch";
// import VideoPlayer from './player/VideoPlayer';
import PlayerClip from "./player/PlayerClip";
import SharedVideoPlayer from "../sharedComponents/SharedVideoPlayer";

const TwitchRoutes = () => {
	return (
		<Routes>
			<Route path="page" element={<ChannelPage />} />
			<Route path="channel" element={<Navigate to={"../page"} replace />} />
			<Route path="channelpage" element={<Navigate to={"../page"} replace />} />
			<Route path="clips" element={<Navigate to={"../page"} replace />} />
			<Route path="videos" element={<Navigate to={"../page"} replace />} />
			<Route path="videos/all" element={<Navigate to={"../page"} replace />} />

			<Route path="videos/:videoId" element={<SharedVideoPlayer />} />
			<Route path="clip/:videoId" element={<PlayerClip />} />
			<Route path="*" element={<NoMatch />} />
		</Routes>
	);
};

export default TwitchRoutes;
