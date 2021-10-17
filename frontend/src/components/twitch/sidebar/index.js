import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SidebarItem from './SidebarItem';
import { Styledsidebar, SidebarHeader } from './StyledComponents';
import LoadingSidebar from './LoadingSidebar';
import VodsContext from '../vods/VodsContext';

const Sidebar = (data) => {
  const { favStreams } = useContext(VodsContext);
  const { onlineStreams, newlyAdded, loaded } = data;
  const [shows, setShows] = useState();
  const resetShowsTimer = useRef();

  const favoriteStreams = onlineStreams.filter((c) =>
    favStreams?.includes(c.user_name?.toLowerCase())
  );
  const nonFavoriteStreams = onlineStreams.filter(
    (c) => !favStreams?.includes(c.user_name?.toLowerCase())
  );

  const sidebarItemAttrs = {
    newlyAdded: newlyAdded,
    shows: shows,
    setShows: setShows,
    resetShowsTimer: resetShowsTimer,
  };
  const cssTransitionAttrs = {
    timeout: 1000,
    classNames: 'sidebarVideoFade-1s',
    unmountOnExit: true,
  };

  if (loaded) {
    return (
      <Styledsidebar id='twitchSidebar'>
        <SidebarHeader>Twitch Live</SidebarHeader>
        {onlineStreams?.length > 0 ? (
          <>
            <TransitionGroup className='sidebar' component={null}>
              {favoriteStreams.map((stream) => (
                <CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
                  <SidebarItem
                    key={stream.user_id}
                    stream={stream}
                    favorited={true}
                    {...sidebarItemAttrs}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
            <TransitionGroup className='sidebar' component={null}>
              {nonFavoriteStreams.map((stream) => (
                <CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
                  <SidebarItem key={stream.user_id} stream={stream} {...sidebarItemAttrs} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </>
        ) : (
          <div
            style={{
              height: '62px',
              padding: '8px 5px 8px 10px',
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <p>None Live</p>
          </div>
        )}
      </Styledsidebar>
    );
  }
  return <LoadingSidebar />;
};
export default Sidebar;
