import React, { useRef, useCallback, useState, useEffect } from "react";
import Moment from "react-moment";
import { Icon } from "react-icons-kit";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { eye } from "react-icons-kit/icomoon/eye";

import styles from "./../Twitch.module.scss";
import StreamHoverIframe from "./../StreamHoverIframe.js";
import Utilities from "../../../utilities/Utilities";

import { ImageContainer, VideoTitle } from "./../../sharedStyledComponents";

const HOVER_DELAY = 1000;

function StreamEle(data) {
  const [isHovered, setIsHovered] = useState(false);

  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  const formatViewerNumbers = viewers => {
    if (viewers.toString().length === 7) {
      return (viewers / 1000000).toString().substring(0, 5) + "m";
    } else if (viewers.toString().length >= 5) {
      return viewers.toString().substring(0, viewers.toString().length - 3) + "k";
    } else {
      return viewers;
    }
  };

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

  return (
    <div className={`${styles.video}`} key={data.data.id}>
      <div style={{ gridArea: "highlight" }}></div>
      {/* <div className={styles.imgContainer} id={data.data.id} ref={ref}> */}
      <ImageContainer ref={ref}>
        {isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={setIsHovered}></StreamHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          <img
            src={
              data.data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </a>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
      </ImageContainer>
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 250, hide: 0 }}
        overlay={
          <Tooltip
            id={`tooltip-${"bottom"}`}
            style={{
              width: "336px",
            }}>
            {data.data.title}
          </Tooltip>
        }>
        <VideoTitle href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {Utilities.truncate(data.data.title, 50)}
        </VideoTitle>
      </OverlayTrigger>
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
          <p className={styles.viewers}>
            {/* {data.data.viewer_count} */}
            {formatViewerNumbers(data.data.viewer_count)}
            <Icon
              icon={eye}
              size={14}
              style={{
                color: "rgb(200, 200, 200)",
                paddingLeft: "5px",
                paddingTop: "3px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default StreamEle;
