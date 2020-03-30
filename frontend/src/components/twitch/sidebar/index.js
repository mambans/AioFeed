import React, { useRef, useCallback, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SidebarItem from "./SidebarItem";
import { Styledsidebar, SidebarHeader } from "./StyledComponents";

const TwitchSidebar = data => {
  const [shows, setShows] = useState();
  const sidebarRef = useRef();

  const handleMouseOut = useCallback(() => {
    setShows(false);
  }, []);

  useEffect(() => {
    const refEle = sidebarRef.current;
    refEle.addEventListener("mouseleave", handleMouseOut);

    return () => {
      refEle.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [handleMouseOut]);

  return (
    <Styledsidebar id='twitchSidebar' ref={sidebarRef}>
      <SidebarHeader>Twitch Live</SidebarHeader>

      {data.onlineStreams.length > 0 ? (
        <TransitionGroup className='sidebar' component={null}>
          {data.onlineStreams.map(stream => {
            return (
              <CSSTransition
                key={stream.id}
                timeout={1000}
                // classNames='fade-1s'
                classNames='sidebarVideoFade-1s'
                unmountOnExit>
                <SidebarItem
                  key={stream.id}
                  stream={stream}
                  newlyAdded={data.newlyAdded}
                  shows={shows}
                  setShows={setShows}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      ) : (
        <div
          style={{
            height: "45.6px",
            padding: "8px 5px 8px 10px",
            fontSize: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}>
          <p>None Live</p>
        </div>
      )}
    </Styledsidebar>
  );
};

export default TwitchSidebar;
