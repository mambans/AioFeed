import React, { useContext, useRef, useState } from "react";

import useEventListenerMemo from "../../hooks/useEventListenerMemo";
import { YoutubeIframe } from "./StyledComponents";
import { YoutubeContext } from "./useToken";
import { useFeedVideoSizeObject } from "../../stores/feedVideoSize";

const HOVER_DELAY = 500;

const VideoHoverIframe = ({ imageRef, data }) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	const { youtubeVideoHoverEnable } = useContext(YoutubeContext);

	const [isHovered, setIsHovered] = useState(false);
	const videoHoverOutTimer = useRef();
	const streamHoverTimer = useRef();

	useEventListenerMemo("mouseenter", handleMouseOver, imageRef.current, youtubeVideoHoverEnable);
	useEventListenerMemo("mouseleave", handleMouseOut, imageRef.current, youtubeVideoHoverEnable);

	function handleMouseOver() {
		clearTimeout(videoHoverOutTimer.current);
		streamHoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DELAY);
	}

	function handleMouseOut(event) {
		clearTimeout(streamHoverTimer.current);
		setIsHovered(false);
		videoHoverOutTimer.current = setTimeout(() => {
			event.target.src = "about:blank";
		}, 200);
	}

	const opts = {
		height: ((feedVideoSizeProps.width || 350) / 16) * 9,
		width: feedVideoSizeProps.width || 350,
		playerVars: {
			autoplay: 1,
			controls: 1,
			origin: "https://aiofeed.com/feed",
			start: 10,
			fs: 0,
		},
	};

	if (isHovered) {
		return <YoutubeIframe videoId={data.contentDetails?.upload?.videoId} opts={opts} id={data.contentDetails?.upload?.videoId + "-iframe"} />;
	}

	return null;
};

export default VideoHoverIframe;
