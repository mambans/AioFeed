import React from "react";
import { ExpandCollapseFeedButton } from "../../sharedComponents/sharedStyledComponents";

import Header, { HeaderNumberCount } from "../../../components/Header";
import BigScheduleList from "./BigScheduleList";
import Colors from "../../../components/themes/Colors";
import ChannelSearchBar from "../searchbars/ChannelSearchBar";
import { InlineError } from "../../navigation/sidebar/StyledComponents";

const TwitchHeader = React.forwardRef(({ data, toggleExpanded, collapsed, idTitle, count }, ref) => {
	const { loading, nextRefresh, refresh, error } = data;

	return (
		<Header
			id="TwitchHeader"
			title={
				<h1 id={"twitch"} onClick={toggleExpanded}>
					Twitch
					<span
						style={{
							background: Colors.red,
							fontWeight: "bold",
							borderRadius: "5px",
							fontSize: "0.9em",
							padding: "0px 3px",
							marginLeft: "5px",
						}}
					>
						Live
					</span>
					<HeaderNumberCount text={count} />
					<ExpandCollapseFeedButton collapsed={collapsed} />
				</h1>
			}
			ref={ref}
			nextRefresh={nextRefresh}
			isLoading={loading}
			refresh={() => refresh({ firstLoad: true })}
			leftSide={error &&
				<InlineError style={{ margin: "0 10px" }}>
					{error}
				</InlineError>
			}
			rightSide={
				<>
					<BigScheduleList />
					{/* <ChannelSearchList placeholder='...' /> */}
					<ChannelSearchBar open={true} />
				</>
			}
		/>
	);
});
export default TwitchHeader;
