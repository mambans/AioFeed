import React, { useState, useEffect, useContext, useCallback } from 'react';

import { CenterContainer } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { useLocation } from 'react-router-dom';

export const CenterContext = React.createContext();

const CenterProvider = ({ children }) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar } = useContext(FeedsContext);
  const [winWidth, setWinWidth] = useState(document.documentElement.clientWidth);
  const path = useLocation().pathname?.slice(0, 5);

  useEventListenerMemo('resize', () => {
    setWinWidth(document.documentElement.clientWidth);
    setVideoElementsAmount(calcVideoElementsAmount());
  });

  const calcVideoElementsAmount = useCallback(
    () =>
      Math.floor(
        (winWidth -
          ((enableTwitch && showTwitchSidebar ? 275 : 0) +
            (enableTwitter && path === '/feed' ? winWidth * (winWidth <= 2560 ? 0.2 : 0.14) : 150) +
            25)) /
          350
      ) * 2,

    [enableTwitch, showTwitchSidebar, enableTwitter, winWidth, path]
  );

  const [videoElementsAmount, setVideoElementsAmount] = useState(calcVideoElementsAmount());

  return (
    <CenterContext.Provider
      value={{
        videoElementsAmount,
        setVideoElementsAmount,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export default ({ children, forceMountTwitch } = {}) => {
  const { enableTwitch, enableTwitter, showTwitchSidebar, twitterLists } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  const NrLists = twitterLists?.length || 1;
  const [winWidth, setWinWidth] = useState(document.documentElement.clientWidth);
  const path = useLocation().pathname?.slice(0, 5);

  useEventListenerMemo('resize', () => {
    setWinWidth(document.documentElement.clientWidth);
  });

  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log('Notifications: ', result);
    });
  }, []);

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
      <CenterContainer
        winWidth={winWidth}
        enableTwitter={enableTwitter}
        enableTwitch={enableTwitch || forceMountTwitch}
        showTwitchSidebar={showTwitchSidebar}
        twitterWidth={
          enableTwitter && !forceMountTwitch
            ? winWidth * (winWidth <= 2560 ? 0.2 * NrLists : 0.14 * NrLists) + NrLists * 20
            : 0
        }
        twitchSidebarWidth={(enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0}
        centerWidth={
          350 *
          Math.floor(
            (winWidth -
              (((enableTwitch || forceMountTwitch) && showTwitchSidebar ? 275 : 0) +
                (enableTwitter && path === '/feed'
                  ? winWidth * (winWidth <= 2560 ? 0.2 * NrLists : 0.14 * NrLists) + NrLists * 20
                  : 150))) /
              350
          )
        }
        id='CenterContainer'
      >
        {children}
      </CenterContainer>
    </CenterProvider>
  );
};
