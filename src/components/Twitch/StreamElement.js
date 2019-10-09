import { Animated } from "react-animated-css";
import React from "react";
import Moment from "react-moment";

import styles from "./Twitch.module.scss";
import StreamHoverIframe from "./StreamHoverIframe.js";
import Utilities from "utilities/Utilities";

function HighlightAnimation({ data }) {
  function checkNewlyAdded(stream) {
    return data.newlyAddedStreams.includes(stream.user_name);
  }

  const Animation = data => {
    return (
      <Animated
        className='highlight'
        animationIn='fadeIn'
        animationOut='zoomOut'
        isVisible={!data.animateOut}
        animationOutDelay={data.delay}
        animationOutDuration={20000}
        style={{ gridArea: "highlight" }}>
        <div
          style={{
            height: 5,
            backgroundColor: "rgb(14, 203, 247)",
            borderRadius: 5,
            gridArea: "highlight",
            width: "100%",
            transition: "all 3.0s ease-in-out",
          }}
        />
      </Animated>
    );
  };

  if (data.newlyAdded || (checkNewlyAdded(data.data) && document.hasFocus())) {
    return <Animation delay={2000} animateOut={true} />;
  } else if (data.newlyAdded || (checkNewlyAdded(data.data) && !document.hasFocus())) {
    return <Animation delay={5000} animateOut={false} />;
  } else {
    return (
      <div
        style={{
          height: 5,
          backgroundColor: "transparent",
          borderRadius: 5,
          gridArea: "highlight",
          width: "100%",
        }}
      />
    );
  }
}

function StreamEle(data) {
  function streamType(type) {
    if (type === "live") {
      return <div className={styles.liveDot} />;
    } else {
      return <p className={styles.type}>{data.data.stream_type}</p>;
    }
  }

  return (
    <div className={`${styles.video}`} key={data.data.id}>
      <HighlightAnimation data={data}></HighlightAnimation>

      <div className={styles.imgContainer} id={data.data.id}>
        {data.isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={data.setIsHovered}></StreamHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {/* href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.data.user_name.toLowerCase()
              }> */}
          <img
            src={
              data.data.thumbnail_url.replace("{width}", 1280).replace("{height}", 720) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </a>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
        {streamType(data.data.type)}
      </div>
      <h4 className={styles.title}>
        <a
          data-tip={data.data.title}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {Utilities.truncate(data.data.title, 50)}
        </a>
      </h4>
      <div>
        <div className={styles.channelContainer}>
          <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </a>
          <p className={styles.channel}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
              {data.data.user_name}
            </a>
          </p>
        </div>
        <div className={styles.gameContainer}>
          <a
            className={styles.game_img}
            href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
            <img
              src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
              alt=''
              className={styles.game_img}></img>
          </a>
          <p className={styles.game}>
            <a href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
              {Utilities.truncate(data.data.game_name, 50)}
            </a>
          </p>
          <p className={styles.viewers}>{data.data.viewer_count}</p>
        </div>
      </div>
    </div>
  );
}

export default StreamEle;
