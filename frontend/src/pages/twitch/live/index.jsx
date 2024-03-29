import { CSSTransition } from "react-transition-group";
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";

import { HideSidebarButton } from "../sidebar/StyledComponents";
import Header from "./Header";
import Sidebar from "../sidebar";
import TwitchStreams from "./Twitch";
import { Container } from "../StyledComponents";
import ToolTip from "../../../components/tooltip/ToolTip";

import ExpandableSection from "../../../components/expandableSection/ExpandableSection";
import { askForBrowserNotificationPermission } from "../../../utilities";
import { MdFormatIndentDecrease } from "react-icons/md";
import { BsCollectionFill } from "react-icons/bs";
import Colors from "../../../components/themes/Colors";
import { TwitchContext } from "../useToken";
import Alert from "../../../components/alert";
import useStreamsStore from "../../../stores/twitch/streams/useStreamsStore";
import moment from "moment";
import { checkAgainstRules } from "../../feedSections/utilities";
// import FeedSections from '../../feedSections/FeedSections';
import getStreamNotifications from "./../getStreamNotifications";
import { useFeedSections } from "../../../stores/twitch/feedSections";
import { useVodsChannels, useVodsFetchChannelVods } from "../../../stores/twitch/vods";
import { useToggleFeedPreference, useFeedPreferences } from "../../../stores/feedPreference";
import { useAddNotifications } from "../../../stores/notifications";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

const FeedSections = React.lazy(() => import("../../feedSections/FeedSections"));

const REFRESH_RATE = 25; // seconds

const TwitchFeed = ({ data, className }) => {
	const feedPreferences = useFeedPreferences();
	const togglePreference = useToggleFeedPreference();
	const feedSections = useFeedSections();
	const { twitch } = feedPreferences || {};
	const { favStreams: favoriteStreams } = useContext(TwitchContext);
	// const [sort, setSort] = useState({ key: "viewers", order: "desc" });

	const nonFeedSectionLiveStreams = useStreamsStore((state) => {
		const enabledFeedSections =
			feedPreferences?.feedSections?.enabled &&
			feedSections &&
			Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

		return state.livestreams?.filter((stream) => !enabledFeedSections?.some?.(({ rules } = {}) => checkAgainstRules(stream, rules, favoriteStreams)));
	});

	const refreshBtnRef = useRef();

	return (
		<>
			<CSSTransition in={twitch?.enabled} timeout={750} classNames="fade-750ms" appear unmountOnExit>
				<Container aria-labelledby="twitch" order={feedPreferences?.["twitch"]?.order || 500} className={className}>
					<Header
						data={data}
						ref={refreshBtnRef}
						collapsed={feedPreferences?.["twitch"]?.collapsed}
						toggleExpanded={() => togglePreference("twitch", "collapsed")}
						count={nonFeedSectionLiveStreams?.length}
						rightSide={null}
					/>
					<ExpandableSection collapsed={feedPreferences?.["twitch"]?.collapsed}>
						<TwitchStreams data={data} streams={nonFeedSectionLiveStreams} />
					</ExpandableSection>
				</Container>
			</CSSTransition>
			<ToolTip placement={"right"} delay={{ show: 500, hide: 0 }} tooltip={`${twitch?.sidebar_enabled ? "Hide" : "Show"} sidebar`}>
				<HideSidebarButton show={String(twitch?.sidebar_enabled)} onClick={() => togglePreference("twitch", "sidebar_enabled")}>
					<MdFormatIndentDecrease size={25.5} />
				</HideSidebarButton>
			</ToolTip>
			<CSSTransition in={twitch?.enabled && twitch?.sidebar_enabled} timeout={750} classNames="twitchSidebar" appear unmountOnExit>
				<Sidebar data={data} />
			</CSSTransition>
			<CSSTransition in={feedPreferences?.feedSections?.enabled} timeout={750} classNames="fade-750ms" unmountOnExit appear>
				<Suspense
					fallback={
						<h1>
							FeedSections..
							<BsCollectionFill size={22} color={Colors.raspberry} />
						</h1>
					}
				>
					<FeedSections data={data} />
				</Suspense>
			</CSSTransition>
		</>
	);
};

export const Twitch = ({ className }) => {
	const {
		autoRefreshEnabled,
		twitchAccessToken,
		twitchUserId,
		isEnabledOfflineNotifications,
		favStreams: favoriteStreams,
	} = useContext(TwitchContext);
	const [nextRefresh, setNextRefresh] = useState(0);
	const { fetch, loading, error, livestreams, previousStreams, canPushNoitifications, loaded, setNewlyAddedStreams, newlyAddedStreams } =
		useStreamsStore();
	const fetchChannelVods = useVodsFetchChannelVods();

	const vodChannels = useVodsChannels();
	const feedSections = useFeedSections();
	const timers = useRef({});
	const timer = useRef();
	const addNotifications = useAddNotifications();
	const resetNewlyAddedStreams = useRef(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(`AioFeed ${(newlyAddedStreams?.length && ` (${newlyAddedStreams?.length})`) || ""}`);

	useEffect(() => {
		setDocumentTitle(`AioFeed ${(newlyAddedStreams?.length && ` (${newlyAddedStreams?.length})`) || ""}`);
	}, [newlyAddedStreams, setDocumentTitle]);

	useEffect(() => {
		if (canPushNoitifications) {
			const notifications = getStreamNotifications({
				currentStreams: livestreams,
				previousStreams,
				feedSections,
				favoriteStreams,
			});

			notifications.forEach((noti) => {
				const type = noti?.type;

				//add notis to notis "log"

				if (type === "offline" && (!isEnabledOfflineNotifications || !vodChannels.includes(noti.stream.user_id))) return;

				if (type === "offline" || type === "live") {
					// clearTimeout(timers.current[noti.stream.user_id]);
					timers.current[noti.stream.user_id] = setTimeout(() => fetchChannelVods({ user_id: noti.stream.user_id, amount: 2 }), 30000);
				}

				if (type === "updated" && !favoriteStreams?.includes(noti.stream.user_id)) return;

				addNotifications([noti]);
			});
		}
	}, [
		livestreams,
		previousStreams,
		feedSections,
		canPushNoitifications,
		favoriteStreams,
		vodChannels,
		isEnabledOfflineNotifications,
		fetchChannelVods,
		addNotifications,
	]);

	useEffect(() => {
		askForBrowserNotificationPermission();
		const timerss = timers.current;

		return () => {
			if (timerss) Object.values(timerss)?.forEach((timer) => clearTimeout(timer));
		};
	}, []);

	useEffect(() => {
		const onFocus = () => {
			resetNewlyAddedStreams.current = true;
		};

		window.addEventListener("blur", onFocus);

		return () => {
			window.removeEventListener("blur", onFocus);
		};
	}, []);

	useEffect(() => {
		console.log(".useEffect.");
		if (!timer.current) {
			if (resetNewlyAddedStreams.current) setNewlyAddedStreams([]);
			resetNewlyAddedStreams.current = false;
			setTimeout(() => fetch(twitchUserId, true), 0);

			if (autoRefreshEnabled) {
				setNextRefresh(moment().add(REFRESH_RATE, "seconds"));

				timer.current = setInterval(() => {
					setNextRefresh(moment().add(REFRESH_RATE, "seconds"));
					if (resetNewlyAddedStreams.current) setNewlyAddedStreams([]);
					resetNewlyAddedStreams.current = false;
					setTimeout(() => fetch(twitchUserId), 0);
				}, REFRESH_RATE * 1000);
			}
		}

		if (!autoRefreshEnabled) {
			setNextRefresh(0);
			clearInterval(timer.current);
			timer.current = null;
		}

		return () => {
			console.log("unmounting Twitch.jsx");
			setNextRefresh(0);
			clearInterval(timer.current);
			timer.current = null;
		};
	}, [fetch, twitchUserId, autoRefreshEnabled, setNewlyAddedStreams]);

	if (!twitchAccessToken) {
		return <Alert title="Not authenticated/connected with Twitch." message="No access token for Twitch available." fill />;
	}

	const data = {
		loading,
		nextRefresh,
		error,
		refresh: () => {
			if (resetNewlyAddedStreams.current) setNewlyAddedStreams([]);
			resetNewlyAddedStreams.current = false;

			return fetch(twitchUserId, true);
		},
		loaded: loaded,
	};

	return <TwitchFeed className={className} data={data} />;
};

// react.memo not doing much atm
export default React.memo(Twitch);
