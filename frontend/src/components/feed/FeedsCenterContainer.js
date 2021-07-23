import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import { useLocation } from 'react-router-dom';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

export const CenterContext = React.createContext();

const CenterProvider = ({ children, fullWidth }) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar, feedVideoSizeProps } =
    useContext(FeedsContext) || {};
  const path = useLocation().pathname?.slice(0, 5);

  const calcVideoElementsAmount = useCallback(
    (clientWidth) => {
      if (fullWidth)
        return (
          Math.floor(
            (clientWidth - 150 / feedVideoSizeProps.totalWidth) / feedVideoSizeProps.totalWidth
          ) * 2
        );

      return (
        Math.floor(
          (clientWidth -
            ((enableTwitch && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? clientWidth * (clientWidth <= 2560 ? 0.19 : 0.14)
                : 150) +
              25)) /
            feedVideoSizeProps.totalWidth
        ) * 2
      );
    },
    [enableTwitch, showTwitchSidebar, enableTwitter, path, fullWidth, feedVideoSizeProps.totalWidth]
  );

  const [videoDisplayData, setVideoDisplayData] = useState({
    videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
    winWidth: document.documentElement.clientWidth,
  });

  return (
    <CenterContext.Provider
      value={{
        ...(videoDisplayData || {}),
        setVideoDisplayData,
        feedVideoSizeProps,
        calcVideoElementsAmount,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

const Center = ({ children, forceMountTwitch, fullWidth }) => {
  const { winWidth, setVideoDisplayData, calcVideoElementsAmount } = useContext(CenterContext);
  const { enableTwitch, enableTwitter, showTwitchSidebar, twitterLists, feedVideoSizeProps } =
    useContext(FeedsContext) || {};
  const NrLists = twitterLists?.length || 1;
  const path = useLocation().pathname?.slice(0, 5);
  const ref = useRef();
  const updateTimer = useRef();

  useEventListenerMemo('resize', () => {
    setVideoDisplayData({
      videoElementsAmount: (ref.current.clientWidth / feedVideoSizeProps.totalWidth) * 2,
      winWidth: document.documentElement.clientWidth,
    });
    clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      setVideoDisplayData({
        videoElementsAmount: (ref.current.clientWidth / feedVideoSizeProps.totalWidth) * 2,
        winWidth: document.documentElement.clientWidth,
      });
    }, 750);
  });

  useEffect(() => {
    setVideoDisplayData({
      videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
      winWidth: document.documentElement.clientWidth,
    });
  }, [setVideoDisplayData, feedVideoSizeProps.totalWidth, calcVideoElementsAmount]);

  return (
    <CenterContainer
      ref={ref}
      fullWidth={fullWidth}
      winWidth={winWidth}
      enableTwitter={enableTwitter}
      enableTwitch={enableTwitch || forceMountTwitch}
      showTwitchSidebar={showTwitchSidebar}
      twitterWidth={
        enableTwitter && !forceMountTwitch
          ? winWidth * (winWidth <= 2560 ? 0.19 * NrLists : 0.14 * NrLists) + NrLists * 20
          : 0
      }
      twitchSidebarWidth={(enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0}
      centerWidth={
        feedVideoSizeProps.totalWidth *
          Math.floor(
            (winWidth -
              (((enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0) +
                (enableTwitter && path === '/feed'
                  ? winWidth * (winWidth <= 2560 ? 0.19 * NrLists : 0.14 * NrLists) + NrLists * 20
                  : 150))) /
              feedVideoSizeProps.totalWidth
          ) +
        1
      }
      id='CenterContainer'
    >
      {children}
    </CenterContainer>
  );
};

const FeedsCenterContainer = ({ children, forceMountTwitch, fullWidth } = {}) => {
  const { username } = useContext(AccountContext);

  if (!username) {
    return (
      <AlertHandler
        title='Login to continue'
        message='You are not logged with your AioFeed account.'
      />
    );
  }

  return (
    <CenterProvider>
      <Center forceMountTwitch={forceMountTwitch} fullWidth={fullWidth}>
        {children}
      </Center>
    </CenterProvider>
  );
};

export default FeedsCenterContainer;
