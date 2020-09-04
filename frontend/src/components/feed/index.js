import { CSSTransition } from 'react-transition-group';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useState, useEffect, useContext, useCallback } from 'react';

import { AddCookie } from '../../util/Utils';
import { Container, CenterContainer } from '../twitch/StyledComponents';
import { HideSidebarButton } from '../twitch/sidebar/StyledComponents';
import { VodsProvider } from './../twitch/vods/VodsContext';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import Handler from '../twitch/live/Handler';
import Header from '../twitch/live/Header';
import NoFeedsEnable from './NoFeedsEnabled';
import Sidebar from '../twitch/sidebar';
import TwitchLive from '../twitch/live';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import Youtube from './../youtube';
import YoutubeDataHandler from './../youtube/Datahandler';
import YoutubeHeader from './../youtube/Header';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

export default () => {
  document.title = 'AioFeed | Feed';
  const {
    enableTwitch,
    enableYoutube,
    enableTwitchVods,
    enableTwitter,
    showTwitchSidebar,
    setShowTwitchSidebar,
    twitterLists,
  } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  const NrLists = twitterLists?.length || 1;
  const [winWidth, setWinWidth] = useState(document.documentElement.clientWidth);

  useEventListenerMemo('resize', () => {
    setWinWidth(document.documentElement.clientWidth);
    setVideoElementsAmount(calcVideoElementsAmount());
  });

  const calcVideoElementsAmount = useCallback(
    () =>
      Math.floor(
        (winWidth -
          ((enableTwitch && showTwitchSidebar ? 275 : 0) +
            (enableTwitter ? winWidth * (winWidth <= 2560 ? 0.2 : 0.14) : 150) +
            25)) /
          350
      ) * 2,

    [enableTwitch, showTwitchSidebar, enableTwitter, winWidth]
  );

  const [videoElementsAmount, setVideoElementsAmount] = useState(calcVideoElementsAmount());

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
    <CenterContainer
      winWidth={winWidth}
      enableTwitter={enableTwitter}
      enableTwitch={enableTwitch}
      showTwitchSidebar={showTwitchSidebar}
      twitterWidth={
        enableTwitter
          ? winWidth * (winWidth <= 2560 ? 0.2 * NrLists : 0.14 * NrLists) + NrLists * 20
          : 0
      }
      twitchSidebarWidth={enableTwitch && showTwitchSidebar ? 275 : 0}
      centerWidth={
        350 *
        Math.floor(
          (winWidth -
            ((enableTwitch && showTwitchSidebar ? 275 : 0) +
              (enableTwitter
                ? winWidth * (winWidth <= 2560 ? 0.2 * NrLists : 0.14 * NrLists) + NrLists * 20
                : 150))) /
            350
        )
      }
      id='CenterContainer'
    >
      <NoFeedsEnable />
      <Twitter />
      <VodsProvider>
        <CSSTransition in={enableTwitch} classNames='fade-750ms' timeout={750} unmountOnExit appear>
          <Handler>
            {(data) => (
              <>
                <CSSTransition
                  in={enableTwitch}
                  timeout={750}
                  classNames='fade-750ms'
                  unmountOnExit
                >
                  <Header data={data} />
                </CSSTransition>
                <CSSTransition
                  in={enableTwitch}
                  timeout={750}
                  classNames='fade-750ms'
                  appear
                  unmountOnExit
                >
                  <TwitchLive data={data} videoElementsAmount={videoElementsAmount} />
                </CSSTransition>

                <OverlayTrigger
                  key={'bottom'}
                  placement={'right'}
                  delay={{ show: 500, hide: 0 }}
                  overlay={
                    <Tooltip id={`tooltip-${'right'}`}>{`${
                      showTwitchSidebar ? 'Hide' : 'Show'
                    } sidebar`}</Tooltip>
                  }
                >
                  <HideSidebarButton
                    show={String(showTwitchSidebar)}
                    onClick={() => {
                      AddCookie('Twitch_SidebarEnabled', !showTwitchSidebar);
                      setShowTwitchSidebar(!showTwitchSidebar);
                    }}
                  >
                    Hide
                  </HideSidebarButton>
                </OverlayTrigger>

                <CSSTransition
                  in={enableTwitch && showTwitchSidebar}
                  timeout={750}
                  classNames='twitchSidebar'
                  appear
                  unmountOnExit
                >
                  <Sidebar
                    setShowTwitchSidebar={setShowTwitchSidebar}
                    loaded={data.loaded}
                    onlineStreams={data.liveStreams}
                    newlyAdded={data.newlyAddedStreams}
                    REFRESH_RATE={data.REFRESH_RATE}
                  />
                </CSSTransition>
              </>
            )}
          </Handler>
        </CSSTransition>

        <CSSTransition in={enableTwitchVods} classNames='fade-750ms' timeout={750} unmountOnExit>
          <Container>
            <TwitchVods videoElementsAmount={videoElementsAmount} />
          </Container>
        </CSSTransition>
      </VodsProvider>

      <CSSTransition in={enableYoutube} timeout={750} classNames='fade-750ms' unmountOnExit appear>
        <Container>
          <YoutubeDataHandler>
            {(data) => (
              <>
                <YoutubeHeader
                  videos={data.videos}
                  setVideos={data.setVideos}
                  refresh={data.refresh}
                  isLoaded={data.isLoaded}
                  requestError={data.requestError}
                  followedChannels={data.followedChannels}
                />

                {data.error && <AlertHandler data={data.error}></AlertHandler>}

                <Youtube
                  requestError={data.requestError}
                  videos={data.videos}
                  videoElementsAmount={videoElementsAmount}
                />
              </>
            )}
          </YoutubeDataHandler>
        </Container>
      </CSSTransition>
    </CenterContainer>
  );
};
