import React from "react";

import { SubFeedContainer } from "./../../sharedComponents/sharedStyledComponents";
import LoadingBoxes from "./../LoadingBoxes";
import { SubFeedHeader } from "./StyledComponents";
import { useFeedVideoSizeObject } from "../../../stores/feedVideoSize";

const LoadingPlaceholderVods = ({ numberOfVideos, title = "Vods", freeze }) => {
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
			<SubFeedContainer style={{ justifyContent: "center", minHeight: "345px", paddingBottom: "0" }}>
				<LoadingBoxes amount={numberOfVideos} type="small" freeze={freeze} />
			</SubFeedContainer>
		</>
	);
};
export default LoadingPlaceholderVods;
