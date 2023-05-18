import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";

import getFollowedVods from "./GetFollowedVods";
import VodElement from "./VodElement";
import LoadMore from "../../../components/loadMore/LoadMore";
import { SubFeedContainer } from "../../sharedComponents/sharedStyledComponents";
import Header from "./Header";
import VodsContext from "./VodsContext";
import LoadingBoxes from "../LoadingBoxes";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import { CenterContext } from "../../feed/FeedsCenterContainer";
import { Container } from "../StyledComponents";
import useToken, { TwitchContext } from "../useToken";
import ExpandableSection from "../../../components/expandableSection/ExpandableSection";
import Alert from "../../../components/alert";
import { getLocalstorage } from "../../../util";
import { useRecoilState, useRecoilValue } from "recoil";
import { twitchVodsAtom, vodChannelsAtom } from "./atoms";
import { feedPreferencesAtom, useFeedPreferences } from "../../../atoms/atoms";

const Vods = ({ className }) => {
	const { fetchVodsContextData } = useContext(VodsContext) || {};
	const [twitchVods, setTwitchVods] = useRecoilState(twitchVodsAtom);

	const channels = useRecoilValue(vodChannelsAtom);
	const { toggleExpanded } = useFeedPreferences();
	const feedPreferences = useRecoilValue(feedPreferencesAtom);

	const { videoElementsAmount } = useContext(CenterContext);
	const { twitchAccessToken } = useContext(TwitchContext);
	const validateToken = useToken();
	const [error, setError] = useState(null);
	const [vodError, setVodError] = useState(null);
	const [vodAmounts, setVodAmounts] = useState({
		amount: videoElementsAmount,
		timeout: 750,
		transitionGroup: "videos",
	});
	const refreshBtnRef = useRef();

	useEventListenerMemo("focus", windowFocusHandler);

	const refresh = useCallback(
		async (forceRefresh = true) => {
			refreshBtnRef?.current?.setIsLoading(true);
			const data = await getFollowedVods({
				forceRun: forceRefresh,
				channels,
				currentVods: getLocalstorage("TwitchVods"),
			});

			setError(data?.er);
			setVodError(data?.vodError);
			if (data?.data) setTwitchVods(data?.data);
			refreshBtnRef?.current?.setIsLoading(false);
		},
		[setTwitchVods, channels]
	);

	const forceRefresh = useCallback(async () => {
		refreshBtnRef?.current?.setIsLoading(true);
		// const vodChannels = await API.getVodChannels();
		// refresh(true, vodChannels);
		fetchVodsContextData();
	}, [fetchVodsContextData]);

	async function windowFocusHandler() {
		refresh(false);
	}

	useEffect(() => {
		console.log("vods index useEffect fetch vods:");
		if (validateToken) {
			refresh();
		}
	}, [validateToken, refresh]);

	useEffect(() => {
		setVodAmounts({
			amount: videoElementsAmount,
			timeout: 750,
			transitionGroup: "videos",
		});
	}, [videoElementsAmount]);

	return (
		<Container aria-labelledby="vods" order={feedPreferences?.["vods"]?.order || 500} className={className}>
			<Header
				ref={refreshBtnRef}
				refresh={forceRefresh}
				vods={twitchVods}
				vodError={vodError}
				collapsed={feedPreferences?.["vods"]?.collapsed}
				toggleExpanded={() => toggleExpanded("vods")}
			/>
			<ExpandableSection collapsed={feedPreferences?.["vods"]?.collapsed}>
				{!twitchAccessToken && <Alert title="Not authenticated/connected with Twitch." message="No access token for twitch availible." />}
				{error && <Alert data={error} fill />}
				{!twitchVods?.data ? (
					<SubFeedContainer>
						<LoadingBoxes amount={videoElementsAmount * 2} type="small" />
					</SubFeedContainer>
				) : (
					<>
						<TransitionGroup className={vodAmounts.transitionGroup || "videos"} component={SubFeedContainer}>
							{(vodAmounts?.showAll ? twitchVods.data : twitchVods.data?.slice(0, vodAmounts.amount))?.map((vod) => (
								<CSSTransition key={vod.id} timeout={vodAmounts.timeout} classNames={vod.transition || "fade-750ms"} unmountOnExit>
									<VodElement data={vod} />
								</CSSTransition>
							))}
						</TransitionGroup>
						<LoadMore
							text="Show more"
							onClick={() => {
								setVodAmounts((curr) => ({
									amount: curr.amount + videoElementsAmount,
									timeout: 750,
									transitionGroup: "videos",
								}));
							}}
							onReset={() => {
								setVodAmounts((curr) => ({
									amount: videoElementsAmount,
									timeout: 750,
									transitionGroup: "videos",
									//transitionGroup: 'instant-disappear',
								}));
								/*clearTimeout(resetTransitionTimer.current);
            resetTransitionTimer.current = setTimeout(() => {
              setVideosToShow((curr) => ({
                amount: curr.amount,
                timeout: 750,
                transitionGroup: 'videos',
              }));
            }, 750);*/
							}}
							reachedEnd={vodAmounts?.amount >= twitchVods.data?.length}
							onShowAll={() => {
								setVodAmounts({
									amount: twitchVods.data?.length,
									timeout: 750,
									transitionGroup: "videos",
									showAll: true,
								});
							}}
						/>
					</>
				)}
			</ExpandableSection>
		</Container>
	);
};
export default Vods;
