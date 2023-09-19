import React, { useContext, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SidebarItem from "./SidebarItem";
import { Styledsidebar, SidebarHeader, StyledSidebarSection } from "./StyledComponents";
import LoadingSidebar from "./LoadingSidebar";
import { TwitchContext } from "../useToken";
import ExpandableSection from "../../../components/expandableSection/ExpandableSection";
import { checkAgainstRules } from "../../feedSections/utilities";
import { ExpandCollapseFeedButton } from "../../sharedComponents/sharedStyledComponents";
import { useFeedSections } from "../../../stores/twitch/feedSections";
import useStreamsStore from "../../../stores/twitch/streams/useStreamsStore";
import { useToggleFeedPreference, useFeedPreferences } from "../../../stores/feedPreference";

const Sidebar = ({ data }) => {
	const { loaded } = data;
	const feedSections = useFeedSections();
	const feedPreferences = useFeedPreferences();
	const { favStreams: favoriteStreams } = useContext(TwitchContext);

	const liveStreams = useStreamsStore((state) => state.livestreams);

	const nonFeedSectionsLiveStreams = liveStreams.filter((stream) => {
		const enabledFeedSections =
			feedPreferences?.feedSections?.enabled &&
			feedSections &&
			Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

		return !enabledFeedSections?.some?.(({ rules } = {}) => checkAgainstRules(stream, rules, favoriteStreams));
	});

	if (loaded) {
		return (
			<Styledsidebar id="twitchSidebar">
				<SidebarSection key={"twitch-sidebar-key"} feed={{ title: "Twitch Live", id: "twitch" }} items={nonFeedSectionsLiveStreams} />

				{feedPreferences?.feedSections?.enabled &&
					feedSections &&
					Object.values(feedSections)
						.reduce((acc, feedsection) => {
							const streams = liveStreams.filter((stream) => checkAgainstRules(stream, feedsection.rules, favoriteStreams));
							if (!feedsection.enabled || !feedsection.sidebar_enabled) return acc;
							return [...acc, { ...feedsection, items: streams }];
						}, [])
						?.map((feed, index) => <SidebarSection key={feed.id} feed={feed} index={index} items={feed.items} />)}
			</Styledsidebar>
		);
	}
	return <LoadingSidebar />;
};
export default Sidebar;

const SidebarSection = ({ feed: { title, id }, items }) => {
	const { favStreams } = useContext(TwitchContext);

	const togglePreference = useToggleFeedPreference();
	const feedPreferences = useFeedPreferences();

	const [shows, setShows] = useState();
	const resetShowsTimer = useRef();

	const { favoriteStreams, nonFavoriteStreams } =
		items?.reduce(
			(acc, stream) => {
				if (favStreams?.includes?.(stream?.user_id)) {
					return { ...acc, favoriteStreams: [...acc.favoriteStreams, stream] };
				}
				return { ...acc, nonFavoriteStreams: [...acc.nonFavoriteStreams, stream] };
			},
			{ favoriteStreams: [], nonFavoriteStreams: [] }
		) || {};

	const sidebarItemAttrs = {
		shows: shows,
		setShows: setShows,
		resetShowsTimer: resetShowsTimer,
	};
	const cssTransitionAttrs = {
		timeout: 1000,
		classNames: "sidebarVideoFade-1s",
		unmountOnExit: true,
	};

	const handleCollapse = () => togglePreference(id, "sidebar_collapsed");

	if (id !== "twitch" && !items?.length) return null;

	return (
		<StyledSidebarSection aria-labelledby={`SidebarSection-${id}`} order={feedPreferences?.[id]?.order || 500}>
			<SidebarHeader id={`SidebarSection-${id}`} onClick={handleCollapse}>
				{title} <ExpandCollapseFeedButton collapsed={feedPreferences?.[id]?.sidebar_collapsed} />
			</SidebarHeader>
			<ExpandableSection collapsed={feedPreferences?.[id]?.sidebar_collapsed}>
				{items?.length ? (
					<>
						<TransitionGroup className="sidebar" component={null}>
							{favoriteStreams.map((stream) => (
								<CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
									<SidebarItem key={stream.user_id} stream={stream} favorited={true} {...sidebarItemAttrs} />
								</CSSTransition>
							))}
						</TransitionGroup>
						<TransitionGroup className="sidebar" component={null}>
							{nonFavoriteStreams.map((stream) => (
								<CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
									<SidebarItem key={stream.user_id} stream={stream} {...sidebarItemAttrs} />
								</CSSTransition>
							))}
						</TransitionGroup>
					</>
				) : (
					<div
						style={{
							height: "62px",
							padding: "8px 5px 8px 10px",
							fontSize: "1rem",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						<p>None Live</p>
					</div>
				)}
			</ExpandableSection>
		</StyledSidebarSection>
	);
};
