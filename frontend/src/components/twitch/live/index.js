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

export default ({ in: forceMount = false }) => {
  const { enableTwitch, showTwitchSidebar, setShowTwitchSidebar } = useContext(FeedsContext);

  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log('Notifications: ', result);
    });
  }, []);

  return (
    <Handler>
      {(data) => (
        <>
          <CSSTransition
            in={enableTwitch || forceMount}
            timeout={750}
            classNames='fade-750ms'
            unmountOnExit
          >
            <Header data={data} />
          </CSSTransition>
          <CSSTransition
            in={enableTwitch || forceMount}
            timeout={750}
            classNames='fade-750ms'
            appear
            unmountOnExit
          >
            <TwitchStreams data={data} />
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
  );
};
