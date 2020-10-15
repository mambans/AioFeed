import React, { useState, useContext, useCallback } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { useLocation } from 'react-router-dom';

export const CenterContext = React.createContext();

const CenterProvider = ({ children, fullWidth }) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar } = useContext(FeedsContext);
  const path = useLocation().pathname?.slice(0, 5);

  useEventListenerMemo('resize', () => {
    setVideoDisplayData({
      videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
      winWidth: document.documentElement.clientWidth,
    });
  });

  const calcVideoElementsAmount = useCallback(
    (clientWidth) => {
      if (fullWidth) return Math.floor((clientWidth - 150 / 350) / 350) * 2;

      return (
        Math.floor(
          (clientWidth -
            ((enableTwitch && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? clientWidth * (clientWidth <= 2560 ? 0.19 : 0.14)
                : 150) +
              25)) /
            350
        ) * 2
      );
    },
    [enableTwitch, showTwitchSidebar, enableTwitter, path, fullWidth]
  );

  const [videoDisplayData, setVideoDisplayData] = useState({
    videoElementsAmount: calcVideoElementsAmount(document.documentElement.clientWidth),
    winWidth: document.documentElement.clientWidth,
  });

  return <CenterContext.Provider value={videoDisplayData}>{children}</CenterContext.Provider>;
};

const Center = ({ children, forceMountTwitch, fullWidth }) => {
  const { winWidth } = useContext(CenterContext);
  const { enableTwitch, enableTwitter, showTwitchSidebar, twitterLists } = useContext(FeedsContext);
  const NrLists = twitterLists?.length || 1;
  const path = useLocation().pathname?.slice(0, 5);

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
        350 *
        Math.floor(
          (winWidth -
            (((enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0) +
              (enableTwitter && path === '/feed'
                ? winWidth * (winWidth <= 2560 ? 0.19 * NrLists : 0.14 * NrLists) + NrLists * 20
                : 150))) /
            350
        )
      }
      id='CenterContainer'
    >
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
