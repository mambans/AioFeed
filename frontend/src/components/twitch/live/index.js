import { CSSTransition } from 'react-transition-group';
import React, { useContext, useEffect, useState } from 'react';

import { AddCookie, getLocalstorage } from '../../../util/Utils';
import { HideSidebarButton } from '../sidebar/StyledComponents';
import FeedsContext from '../../feed/FeedsContext';
import Handler from './Handler';
import Header from './Header';
import Sidebar from '../sidebar';
import TwitchStreams from './Twitch';
import FeedsCenterContainer from '../../feed/FeedsCenterContainer';
import { VodsProvider } from '../vods/VodsContext';
import { Container } from '../StyledComponents';
import ToolTip from '../../sharedComponents/ToolTip';

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

  const [order, setOrder] = useState(getLocalstorage('FeedOrders')?.['Twitch'] ?? 9);

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
            appear
            unmountOnExit
          >
            <Container order={order}>
              <Header data={data} setOrder={setOrder} />
              <TwitchStreams data={data} />
            </Container>
          </CSSTransition>

          <ToolTip
            placement={'right'}
            delay={{ show: 500, hide: 0 }}
            tooltip={`${showTwitchSidebar ? 'Hide' : 'Show'} sidebar`}
          >
            <HideSidebarButton
              show={String(showTwitchSidebar)}
              onClick={() => {
                AddCookie('Twitch_SidebarEnabled', !showTwitchSidebar);
                setShowTwitchSidebar(!showTwitchSidebar);
              }}
            />
          </ToolTip>
          <ToolTip
            placement={'right'}
            delay={{ show: 500, hide: 0 }}
            tooltip={`${showTwitchBigFeed ? 'Hide' : 'Show'} big feed`}
          >
            <HideSidebarButton
              show={String(showTwitchBigFeed)}
              side={'right'}
              onClick={() => {
                AddCookie('Twitch_BigFeedEnabled', !showTwitchBigFeed);
                setShowTwitchBigFeed(!showTwitchBigFeed);
              }}
            />
          </ToolTip>

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
