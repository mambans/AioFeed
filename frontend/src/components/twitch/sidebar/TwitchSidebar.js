import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import TwitchSidebarItem from "./TwitchSidebarItem";
import styles from "./../Twitch.module.scss";

const TwitchSidebar = data => {
  // eslint-disable-next-line
  const [sidebarTop, setSidebarTop] = useState("false");

  return (
    <div className={styles.sidebar} id='twitchSidebar' fixedtop={sidebarTop}>
      <p className={styles.twitchSidebarHeader}>Twitch Live</p>

      {data.onlineStreams.length > 0 ? (
        <TransitionGroup className='sidebar' component={null}>
          {data.onlineStreams.map(stream => {
            return (
              <CSSTransition
                // in={data.newlyAdded.includes(stream.user_name)}
                key={stream.id}
                timeout={1000}
                // classNames='fade-1s'
                classNames='sidebarVideoFade-1s'
                unmountOnExit>
                <TwitchSidebarItem
                  key={stream.id}
                  stream={stream}
                  newlyAdded={data.newlyAdded}
                  REFRESH_RATE={data.REFRESH_RATE}></TwitchSidebarItem>
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
    </div>
  );
};

export default TwitchSidebar;
