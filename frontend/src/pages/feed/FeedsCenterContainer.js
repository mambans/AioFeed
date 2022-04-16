import React, { useState, useContext, useCallback, useEffect } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import FeedsContext from './FeedsContext';
import useEventListenerMemo from './../../hooks/useEventListenerMemo';

export const CenterContext = React.createContext();

const CenterProvider = ({ children, left, right }) => {
  const { feedVideoSizeProps, enableTwitter, showTwitchSidebar } = useContext(FeedsContext) || {};

  const [videoDisplayData, setVideoDisplayData] = useState({
    videoElementsAmount: 3,
  });
  const [twittersWidth, setTwitterWidth] = useState({});
  const twitterContainerWidth =
    Object.values?.(twittersWidth)?.reduce((a, b) => a + (b + 10), 0) || window.outerWidth * 0.12;
  const leftWidth = left && (showTwitchSidebar ? 275 : 0);
  const rightWidth = right && enableTwitter && twitterContainerWidth;

  const calcVideoElementsAmount = useCallback(
    () =>
      Math.floor(
        (document.documentElement.clientWidth - (leftWidth + rightWidth + 50)) /
          feedVideoSizeProps.totalWidth
      ) * 2,

    [feedVideoSizeProps.totalWidth, leftWidth, rightWidth]
  );

  const reCalcWidthAndAmount = useCallback(() => {
    const amountOfVideos = calcVideoElementsAmount();
    setVideoDisplayData({
      videoElementsAmount: amountOfVideos,
      width: (amountOfVideos / 2) * feedVideoSizeProps.totalWidth + 5,
    });
  }, [calcVideoElementsAmount, feedVideoSizeProps]);

  useEventListenerMemo('resize', () => reCalcWidthAndAmount());
  useEffect(() => reCalcWidthAndAmount(), [reCalcWidthAndAmount]);

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
  const { enableTwitter, showTwitchSidebar } = useContext(FeedsContext) || {};

  return (
    <CenterContainer
      left={leftWidth && (showTwitchSidebar ? 275 : 0)}
      right={rightWidth && enableTwitter && twitterWidth}
      centerWidth={width}
      id='CenterContainer'
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
