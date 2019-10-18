import { Animated } from "react-animated-css";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Moment from "react-moment";
import { Button } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { cross } from "react-icons-kit/icomoon/cross";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "./Twitch.module.scss";
import StreamHoverIframe from "./StreamHoverIframe.js";
import Utilities from "utilities/Utilities";
import UnfollowStream from "./UnfollowStream";

const HOVER_DELAY = 1000;

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
            // backgroundColor: "rgb(14, 203, 247)",
            backgroundColor: "#d18a07",
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
  const [isHovered, setIsHovered] = useState(false);
  const [channelIsHovered, setChannelIsHovered] = useState(false);
  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  function streamType(type) {
    if (type === "live") {
      return <div className={styles.liveDot} />;
    } else {
      return <p className={styles.type}>{data.data.stream_type}</p>;
    }
  }

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(event => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (ref.current && localStorage.getItem(`TwitchVideoHoverEnabled`) === "true") {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [handleMouseOut]);

  const handleMouseOverChannel = () => {
    setChannelIsHovered(true);
  };

  const handleMouseOutChannel = () => {
    setChannelIsHovered(false);
  };

  useEffect(() => {
    if (refChannel.current) {
      const refEle = refChannel.current;
      refChannel.current.addEventListener("mouseenter", handleMouseOverChannel);
      refChannel.current.addEventListener("mouseleave", handleMouseOutChannel);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOverChannel);
        refEle.removeEventListener("mouseleave", handleMouseOutChannel);
      };
    }
  }, []);

  return (
    <div className={`${styles.video}`} key={data.data.id}>
      <HighlightAnimation data={data}></HighlightAnimation>

      <div className={styles.imgContainer} id={data.data.id} ref={ref}>
        {isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={setIsHovered}></StreamHoverIframe>
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
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip
              id={`tooltip-${"bottom"}`}
              style={{
                width: "320px",
              }}>
              {data.data.title}
            </Tooltip>
          }>
          <a
            // data-tip={data.data.title}
            href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
            {Utilities.truncate(data.data.title, 50)}
          </a>
        </OverlayTrigger>
      </h4>
      <div>
        <div className={styles.channelContainer} ref={refChannel}>
          <a
            href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}
            style={{ gridRow: 1 }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </a>
          <p className={styles.channel}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
              {data.data.user_name}
            </a>
          </p>
          {channelIsHovered ? (
            <OverlayTrigger
              key={"bottom"}
              placement={"bottom"}
              delay={250}
              overlay={
                <Tooltip id={`tooltip-${"bottom"}`}>
                  Unfollow <strong>{data.data.user_name}</strong>.
                </Tooltip>
              }>
              <Button
                data-tip={"Unfollow " + data.data.user}
                variant='link'
                onClick={() => {
                  UnfollowStream({ user_id: data.data.user_id, refresh: data.refresh });
                }}
                className={styles.unfollowButton}>
                <Icon icon={cross} size={18} className={styles.unfollowIcon} />
              </Button>
            </OverlayTrigger>
          ) : null}
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
