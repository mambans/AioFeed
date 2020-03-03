import { FaRegEye } from "react-icons/fa";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import { ImageContainer, VideoTitle } from "./../../sharedStyledComponents";
import StreamHoverIframe from "./../StreamHoverIframe.js";
import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

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
      <ImageContainer ref={ref}>
        {isHovered ? (
          <StreamHoverIframe id={data.data.id} data={data.data} setIsHovered={setIsHovered} />
        ) : null}
        <Link
          to={{
            pathname: "/live/" + data.data.user_name.toLowerCase(),
            state: {
              p_uptime: data.data.started_at,
              p_title: data.data.title,
              p_game: data.data.game_name,
              p_viewers: data.data.viewers,
            },
          }}
          className={styles.img}>
          <img
            src={
              data.data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </Link>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
      </ImageContainer>
      {data.data.title.length > 50 ? (
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
          <VideoTitle
            to={{
              pathname: "/live/" + data.data.user_name.toLowerCase(),
              state: {
                p_uptime: data.data.started_at,
                p_title: data.data.title,
                p_game: data.data.game_name,
                p_viewers: data.data.viewers,
              },
            }}>
            {Utilities.truncate(data.data.title, 50)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: "/live/" + data.data.user_name.toLowerCase(),
            state: {
              p_uptime: data.data.started_at,
              p_title: data.data.title,
              p_game: data.data.game_name,
              p_viewers: data.data.viewers,
            },
          }}>
          {data.data.title}
        </VideoTitle>
      )}
      <div>
        <div className={styles.channelContainer} ref={refChannel}>
          <Link
            to={{
              pathname: `/channel/${data.data.user_name.toLowerCase()}`,
              state: {
                p_id: data.data.user_id,
              },
            }}
            style={{ gridRow: 1 }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </Link>
          <Link
            to={{
              pathname: `/channel/${data.data.user_name.toLowerCase()}`,
              state: {
                p_id: data.data.user_id,
              },
            }}
            className={styles.channel}>
            {data.data.user_name}
          </Link>
        </div>
        <div className={styles.gameContainer}>
          <Link className={styles.game_img} to={"/game/" + data.data.game_name}>
            <img
              src={
                data.data.game_img
                  ? data.data.game_img.replace("{width}", 130).replace("{height}", 173)
                  : `${process.env.PUBLIC_URL}/images/placeholder.jpg`
              }
              alt=''
              className={styles.game_img}></img>
          </Link>
          <Link className={styles.game} to={"/game/" + data.data.game_name}>
            {data.data.game_name}
          </Link>
          <p className={styles.viewers}>
            {/* {data.data.viewer_count} */}
            {formatViewerNumbers(data.data.viewer_count)}
            <FaRegEye
              style={{
                color: "rgb(200, 200, 200)",
                marginLeft: "5px",
                marginTop: "3px",
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
