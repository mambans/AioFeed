import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import { useLocation } from 'react-router-dom';
import { FeedSizeBtn, FeedSizeIcon } from '../sharedStyledComponents';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

export const CenterContext = React.createContext();

const CenterProvider = ({ children, fullWidth }) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar, feedSizesObj } =
    useContext(FeedsContext) || {};
  const path = useLocation().pathname?.slice(0, 5);

  const calcVideoElementsAmount = useCallback(
    (clientWidth) => {
      if (fullWidth)
        return (
          Math.floor((clientWidth - 150 / feedSizesObj.totalWidth) / feedSizesObj.totalWidth) * 2
        );

      return (
        Math.floor(
          (clientWidth -
            ((enableTwitch && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? clientWidth * (clientWidth <= 2560 ? 0.19 : 0.14)
                : 150) +
              25)) /
            feedSizesObj.totalWidth
        ) * 2
      );
    },
    [enableTwitch, showTwitchSidebar, enableTwitter, path, fullWidth, feedSizesObj.totalWidth]
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
        feedSizesObj: feedSizesObj,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

const Center = ({ children, forceMountTwitch, fullWidth }) => {
  const { winWidth, setVideoDisplayData } = useContext(CenterContext);
  const {
    enableTwitch,
    enableTwitter,
    showTwitchSidebar,
    twitterLists,
    feedSize,
    feedSizesObj,
    setFeedSize,
  } = useContext(FeedsContext) || {};
  const NrLists = twitterLists?.length || 1;
  const path = useLocation().pathname?.slice(0, 5);
  const ref = useRef();

  const onClickDefault = () => {
    localStorage.setItem('Feed-size', 'default');
    setFeedSize('default');
  };

  const onClickSmall = () => {
    localStorage.setItem('Feed-size', 'small');
    setFeedSize('small');
  };

  useEventListenerMemo('resize', () => {
    setVideoDisplayData({
      videoElementsAmount: (ref.current.clientWidth / feedSizesObj.totalWidth) * 2,
      winWidth: document.documentElement.clientWidth,
    });
  });

  useEffect(() => {
    const centerContainer = ref.current;
    setVideoDisplayData({
      videoElementsAmount: Math.trunc(
        Math.round((centerContainer.clientWidth / feedSizesObj.totalWidth) * 2)
      ),
      winWidth: document.documentElement.clientWidth,
    });
  }, [setVideoDisplayData, feedSizesObj.totalWidth]);

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
        feedSizesObj.totalWidth *
        Math.floor(
          (winWidth -
            (((enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? winWidth * (winWidth <= 2560 ? 0.19 * NrLists : 0.14 * NrLists) + NrLists * 20
                : 150))) /
            feedSizesObj.totalWidth
        )
      }
      id='CenterContainer'
    >
      <FeedSizeBtn>
        <FeedSizeIcon size={22} active={String(feedSize === 'default')} onClick={onClickDefault} />
        <FeedSizeIcon size={16} active={String(feedSize === 'small')} onClick={onClickSmall} />
      </FeedSizeBtn>
      {children}
    </CenterContainer>
  );
};

export default ({ children, forceMountTwitch, fullWidth } = {}) => {
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
