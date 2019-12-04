import React, { useState } from "react";
import { Animated } from "react-animated-css";

import TwitchSidebarItem from "./TwitchSidebarItem";
import styles from "./../Twitch.module.scss";

const TwitchSidebar = data => {
  // eslint-disable-next-line
  const [sidebarTop, setSidebarTop] = useState("false");

  return (
    <Animated animationIn='fadeIn' animationOut='fadeOut' isVisible={true} key={"sidebar"}>
      <div className={styles.sidebar} id='twitchSidebar' fixedtop={sidebarTop}>
        <p className={styles.twitchSidebarHeader}>Twitch Live</p>
        {data.onlineStreams.length > 0 ? (
          data.onlineStreams.map(stream => {
            return data.newlyAdded.includes(stream.user_name) ? (
              <Animated
                animationIn='fadeInUp'
                animationOut='fadeOut'
                isVisible={true}
                key={stream.id}>
                <TwitchSidebarItem
                  key={stream.id}
                  stream={stream}
                  newlyAdded={data.newlyAdded}
                  REFRESH_RATE={data.REFRESH_RATE}></TwitchSidebarItem>
              </Animated>
            ) : (
              <TwitchSidebarItem
                key={stream.id}
                stream={stream}
                newlyAdded={data.newlyAdded}
                REFRESH_RATE={data.REFRESH_RATE}></TwitchSidebarItem>
            );
          })
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
    </Animated>
  );
};

export default TwitchSidebar;
