import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";

import VodElement from "./VodElement";
import LoadMore from "../../../components/loadMore/LoadMore";
import { SubFeedContainer } from "../../sharedComponents/sharedStyledComponents";
import Header from "./Header";
import LoadingBoxes from "../LoadingBoxes";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import { CenterContext } from "../../feed/FeedsCenterContainer";
import { Container } from "../StyledComponents";
import useToken, { TwitchContext } from "../useToken";
import ExpandableSection from "../../../components/expandableSection/ExpandableSection";
import Alert from "../../../components/alert";
import { useVods, useVodsError, useVodsFetch } from "../../../stores/twitch/vods";
import { useToggleFeedPreference, useFeedPreferences } from "../../../stores/feedPreference";

const Vods = ({ className }) => {
	const fetch = useVodsFetch();
	const vods = useVods();
	const { error, vodError } = useVodsError();

	const togglePreference = useToggleFeedPreference();
	const feedPreferences = useFeedPreferences();

	const { videoElementsAmount } = useContext(CenterContext);
	const { twitchAccessToken } = useContext(TwitchContext);
	const validateToken = useToken();
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
			await fetch(forceRefresh);
			refreshBtnRef?.current?.setIsLoading(false);
		},
		[fetch]
	);

	async function windowFocusHandler() {
		refresh(false);
	}

	useEffect(() => {
		console.log("vods index useEffect fetch vods:");
		console.log("validateToken:", validateToken);
		// if (validateToken) {
		refresh(true);
		// }
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
				refresh={() => refresh(true)}
				vods={vods}
				vodError={vodError}
				collapsed={feedPreferences?.["vods"]?.collapsed}
				toggleExpanded={() => togglePreference("vods", "collapsed")}
			/>
			<ExpandableSection collapsed={feedPreferences?.["vods"]?.collapsed}>
				{!twitchAccessToken && <Alert title="Not authenticated/connected with Twitch." message="No access token for twitch availible." />}
				{error && <Alert data={error} fill />}
				{!vods?.data ? (
					<SubFeedContainer>
						<LoadingBoxes amount={videoElementsAmount * 2} type="small" />
					</SubFeedContainer>
				) : (
					<>
						<TransitionGroup className={vodAmounts.transitionGroup || "videos"} component={SubFeedContainer}>
							{(vodAmounts?.showAll ? vods.data : vods.data?.slice(0, vodAmounts.amount))?.map((vod) => (
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
							reachedEnd={vodAmounts?.amount >= vods.data?.length}
							onShowAll={() => {
								setVodAmounts({
									amount: vods.data?.length,
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
