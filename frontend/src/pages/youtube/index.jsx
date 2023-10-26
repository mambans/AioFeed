import React from "react";
import ExpandableSection from "../../components/expandableSection/ExpandableSection";
import { Container } from "../twitch/StyledComponents";

import YoutubeDataHandler from "./Datahandler";
import YoutubeHeader from "./Header";
import YoutubeHandler from "./YoutubeHandler";
import Alert from "../../components/alert";
import { useToggleFeedPreference, useFeedPreferences } from "../../stores/feedPreference";

const Youtube = ({ className }) => {
	const togglePreference = useToggleFeedPreference();
	const feedPreferences = useFeedPreferences();

	return (
		<YoutubeDataHandler>
			{(data) => (
				<Container aria-labelledby="youtube" order={feedPreferences?.["youtube"]?.order || 500} className={className}>
					<YoutubeHeader
						videos={data.videos}
						setVideos={data.setVideos}
						refresh={data.refresh}
						isLoaded={data.isLoaded}
						requestError={data.requestError}
						followedChannels={data.followedChannels}
						collapsed={feedPreferences?.["youtube"]?.collapsed}
						toggleExpanded={() => togglePreference("youtube", "collapsed")}
					/>

					{data.error && <Alert data={data.error}></Alert>}
					<ExpandableSection collapsed={feedPreferences?.["youtube"]?.collapsed}>
						<YoutubeHandler requestError={data.requestError} videos={data.videos} />
					</ExpandableSection>
				</Container>
			)}
		</YoutubeDataHandler>
	);
};

export default Youtube;
