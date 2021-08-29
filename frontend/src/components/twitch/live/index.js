import { CSSTransition } from 'react-transition-group';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { getLocalstorage } from '../../../util/Utils';
import { HideSidebarButton } from '../sidebar/StyledComponents';
import FeedsContext from '../../feed/FeedsContext';
import Handler from './Handler';
import Header from './Header';
import Sidebar from '../sidebar';
import TwitchStreams from './Twitch';
import FeedsCenterContainer from '../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';
import ToolTip from '../../sharedComponents/ToolTip';
import { CustomFilterProvider } from '../CustomFilters/CustomFilterContext';

const TwitchStandalone = () => (
  <FeedsCenterContainer left={true} right={false}>
    <Twitch in={true} className='feed' />
  </FeedsCenterContainer>
);

export const Twitch = ({ in: forceMount = false, className }) => {
  const {
    enableTwitch,
    showTwitchSidebar,
    setShowTwitchSidebar,
    showTwitchBigFeed,
    setShowTwitchBigFeed,
  } = useContext(FeedsContext) || {};

  const [order, setOrder] = useState(getLocalstorage('FeedOrders')?.['Twitch'] ?? 9);
  const refreshBtnRef = useRef();

  useEffect(() => {
    Notification.requestPermission().then(
      (result) => result !== 'granted' && console.log('Notifications: ', result)
    );
  }, []);

  return (
    <CustomFilterProvider>
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
              <Container order={order} className={className}>
                <Header data={data} setOrder={setOrder} ref={refreshBtnRef} />
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
                onClick={() => setShowTwitchSidebar(!showTwitchSidebar)}
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
                onClick={() => setShowTwitchBigFeed(!showTwitchBigFeed)}
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
    </CustomFilterProvider>
  );
};
export default TwitchStandalone;
