import React, { useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SidebarItem from './SidebarItem';
import { Styledsidebar, SidebarHeader } from './StyledComponents';
import LoadingSidebar from './LoadingSidebar';

export default (data) => {
  const { onlineStreams, newlyAdded, loaded } = data;
  const [shows, setShows] = useState();
  const resetShowsTimer = useRef();

  if (loaded) {
    return (
      <Styledsidebar id='twitchSidebar'>
        <SidebarHeader>Twitch Live</SidebarHeader>

        {onlineStreams?.length > 0 ? (
          <TransitionGroup className='sidebar' component={null}>
            {onlineStreams.map((stream) => {
              return (
                <CSSTransition
                  key={stream.user_id}
                  timeout={1000}
                  classNames='sidebarVideoFade-1s'
                  unmountOnExit
                >
                  <SidebarItem
                    key={stream.user_id}
                    stream={stream}
                    newlyAdded={newlyAdded}
                    shows={shows}
                    setShows={setShows}
                    resetShowsTimer={resetShowsTimer}
                  />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
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
  } else {
    return <LoadingSidebar />;
  }
};
