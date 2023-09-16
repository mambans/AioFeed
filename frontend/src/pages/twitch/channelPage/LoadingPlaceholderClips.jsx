import React from "react";

import { SubFeedContainer } from "./../../sharedComponents/sharedStyledComponents";
import LoadingBoxes from "./../LoadingBoxes";
import { SubFeedHeader } from "./StyledComponents";
import { useFeedVideoSizeObject } from "../../../stores/feedVideoSize";

const LoadingPlaceholderClips = ({ numberOfVideos, title = "Clips", freeze }) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	return (
		<>
			<SubFeedHeader
				style={{
					width: `${numberOfVideos * (feedVideoSizeProps?.totalWidth || 350)}px`,
				}}
			>
				<h3>{title}</h3>
			</SubFeedHeader>

			<SubFeedContainer style={{ justifyContent: "center", minHeight: "310px", paddingBottom: "0" }}>
				<LoadingBoxes amount={numberOfVideos} type="big" freeze={freeze} />
			</SubFeedContainer>
		</>
	);
};
export default LoadingPlaceholderClips;
