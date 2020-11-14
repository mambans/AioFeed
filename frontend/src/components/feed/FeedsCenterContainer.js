import React, { useState, useContext, useCallback } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { useLocation } from 'react-router-dom';
import { FeedSizeBtn, FeedSizeIcon } from '../sharedStyledComponents';

export const CenterContext = React.createContext();

const CenterProvider = ({ children, fullWidth }) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar, feedSize } =
    useContext(FeedsContext) || {};
  const path = useLocation().pathname?.slice(0, 5);
  const size = feedSize === 'small' ? 280 : 350;

  useEventListenerMemo('resize', () => {
    setVideoDisplayData({
      videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
      winWidth: document.documentElement.clientWidth,
    });
  });

  const calcVideoElementsAmount = useCallback(
    (clientWidth) => {
      if (fullWidth) return Math.floor((clientWidth - 150 / size) / size) * 2;

      return (
        Math.floor(
          (clientWidth -
            ((enableTwitch && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? clientWidth * (clientWidth <= 2560 ? 0.19 : 0.14)
                : 150) +
              25)) /
            size
        ) * 2
      );
    },
    [enableTwitch, showTwitchSidebar, enableTwitter, path, fullWidth, size]
  );

  const [videoDisplayData, setVideoDisplayData] = useState({
    videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
    winWidth: document.documentElement.clientWidth,
  });

  return <CenterContext.Provider value={videoDisplayData}>{children}</CenterContext.Provider>;
};

const Center = ({ children, forceMountTwitch, fullWidth }) => {
  const { winWidth } = useContext(CenterContext);
  const { enableTwitch, enableTwitter, showTwitchSidebar, twitterLists, feedSize, setFeedSize } =
    useContext(FeedsContext) || {};
  const NrLists = twitterLists?.length || 1;
  const path = useLocation().pathname?.slice(0, 5);
  const size = feedSize === 'small' ? 280 : 350;

  const onClickDefault = () => {
    localStorage.setItem('Feed-size', 'default');
    setFeedSize('default');
  };

  const onClickSmall = () => {
    localStorage.setItem('Feed-size', 'small');
    setFeedSize('small');
  };

  return (
    <CenterContainer
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
        size *
        Math.floor(
          (winWidth -
            (((enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? winWidth * (winWidth <= 2560 ? 0.19 * NrLists : 0.14 * NrLists) + NrLists * 20
                : 150))) /
            size
        )
      }
      id='CenterContainer'
    >
      <FeedSizeBtn>
        <FeedSizeIcon size={22} active={feedSize === 'default'} onClick={onClickDefault} />
        <FeedSizeIcon size={16} active={feedSize === 'small'} onClick={onClickSmall} />
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
