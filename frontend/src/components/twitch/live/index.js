import { CSSTransition } from 'react-transition-group';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';

import { AddCookie } from '../../../util/Utils';
import { HideSidebarButton } from '../sidebar/StyledComponents';
import FeedsContext from '../../feed/FeedsContext';
import Handler from './Handler';
import Header from './Header';
import Sidebar from '../sidebar';
import TwitchStreams from './Twitch';
import FeedsCenterContainer from '../../feed/FeedsCenterContainer';
import { VodsProvider } from '../vods/VodsContext';

export default ({ forceMountTwitch = false } = {}) => (
  <FeedsCenterContainer forceMountTwitch={forceMountTwitch}>
    <VodsProvider>
      <Twitch in={forceMountTwitch} />
    </VodsProvider>
  </FeedsCenterContainer>
);

export const Twitch = ({ in: forceMount = false }) => {
  const {
    enableTwitch,
    showTwitchSidebar,
    setShowTwitchSidebar,
    showTwitchBigFeed,
    setShowTwitchBigFeed,
  } = useContext(FeedsContext) || {};

  useEffect(() => {
    Notification.requestPermission().then((result) => console.log('Notifications: ', result));
  }, []);

  return (
    <Handler>
      {(data) => (
        <>
          <CSSTransition
            in={(showTwitchBigFeed && enableTwitch) || forceMount}
            timeout={750}
            classNames='fade-750ms'
            unmountOnExit
          >
            <Header data={data} />
          </CSSTransition>
          <CSSTransition
            in={(showTwitchBigFeed && enableTwitch) || forceMount}
            timeout={750}
            classNames='fade-750ms'
            appear
            unmountOnExit
          >
            <TwitchStreams data={data} />
          </CSSTransition>

          <OverlayTrigger
            key={'HideSidebarButtonTooltip'}
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
            />
          </OverlayTrigger>
          <OverlayTrigger
            key={'HideTwitchBigFeedButtonTooltip'}
            placement={'right'}
            delay={{ show: 500, hide: 0 }}
            overlay={
              <Tooltip id={`tooltip-${'right'}`}>{`${
                showTwitchBigFeed ? 'Hide' : 'Show'
              } big feed`}</Tooltip>
            }
          >
            <HideSidebarButton
              show={String(showTwitchBigFeed)}
              side={'right'}
              onClick={() => {
                AddCookie('Twitch_BigFeedEnabled', !showTwitchBigFeed);
                setShowTwitchBigFeed(!showTwitchBigFeed);
              }}
            />
          </OverlayTrigger>

          <CSSTransition
            in={(enableTwitch || forceMount) && showTwitchSidebar}
            timeout={750}
            classNames='twitchSidebar'
            appear
            unmountOnExit
          >
            <Sidebar
              loaded={data.loaded}
              onlineStreams={data.liveStreams}
              newlyAdded={data.newlyAddedStreams}
            />
          </CSSTransition>
        </>
      )}
    </Handler>
  );
};
