import React, { useState, useContext, useCallback, useLayoutEffect } from "react";

import { CenterContainer } from "../twitch/StyledComponents";
import useEventListenerMemo from "./../../hooks/useEventListenerMemo";
import { useFeedPreferences } from "../../stores/feedPreference";
import { useFeedVideoSizeObject } from "../../stores/feedVideoSize";

export const CenterContext = React.createContext();

const CenterProvider = ({ children, left, right }) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();
	const feedPreferences = useFeedPreferences();

	const [videoDisplayData, setVideoDisplayData] = useState({
		videoElementsAmount: 3,
	});
	const [twittersWidth, setTwitterWidth] = useState({});
	const twitterContainerWidth = Object.values?.(twittersWidth)?.reduce((a, b) => a + (b + 10), 0) || window.outerWidth * 0.12;
	const leftWidth = (left && (feedPreferences?.twitch?.sidebar_enabled ? 275 : 0)) || 0;
	const rightWidth = (right && feedPreferences?.twitter?.enabled && twitterContainerWidth) || 0;

	const calcVideoElementsAmount = useCallback(
		() => Math.floor((document.documentElement.clientWidth - (leftWidth + rightWidth + 50)) / feedVideoSizeProps.totalWidth) * 2,

		[feedVideoSizeProps.totalWidth, leftWidth, rightWidth]
	);

	const reCalcWidthAndAmount = useCallback(() => {
		const amountOfVideos = calcVideoElementsAmount();

		setVideoDisplayData({
			videoElementsAmount: amountOfVideos,
			width: (amountOfVideos / 2) * feedVideoSizeProps.totalWidth + 5,
		});
	}, [calcVideoElementsAmount, feedVideoSizeProps]);

	useEventListenerMemo("resize", () => reCalcWidthAndAmount());
	useLayoutEffect(() => {
		reCalcWidthAndAmount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CenterContext.Provider
			value={{
				...(videoDisplayData || {}),
				feedVideoSizeProps,
				reCalcWidthAndAmount,
				twitterWidth: twitterContainerWidth,
				setTwitterWidth,
				leftWidth,
				rightWidth,
			}}
		>
			{children}
		</CenterContext.Provider>
	);
};

const Center = ({ children }) => {
	const { width, twitterWidth, leftWidth, rightWidth } = useContext(CenterContext);
	const feedPreferences = useFeedPreferences();

	return (
		<CenterContainer
			left={leftWidth && (feedPreferences?.twitch?.sidebar_enabled ? 275 : 0)}
			right={rightWidth && feedPreferences?.twitter?.enabled && twitterWidth}
			centerWidth={width}
			id="CenterContainer"
		>
			{children}
		</CenterContainer>
	);
};

const FeedsCenterContainer = ({ children, left = true, right = true } = {}) => {
	return (
		<CenterProvider left={left} right={right}>
			<Center>{children}</Center>
		</CenterProvider>
	);
};

export default FeedsCenterContainer;
