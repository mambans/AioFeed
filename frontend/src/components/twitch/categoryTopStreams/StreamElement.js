import { FaRegEye } from "react-icons/fa";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import { ImageContainer, VideoTitle, VideoContainer } from "./../../sharedStyledComponents";
import StreamHoverIframe from "./../StreamHoverIframe.js";
import styles from "./../Twitch.module.scss";
import Util from "../../../util/Util";
import FeedsContext from "../../feed/FeedsContext";

const HOVER_DELAY = 1000;

export default ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();
  const { twitchVideoHoverEnable } = useContext(FeedsContext);

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
    if (ref.current && twitchVideoHoverEnable) {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [handleMouseOut, twitchVideoHoverEnable]);

  return (
    <VideoContainer key={data.id}>
      <ImageContainer ref={ref}>
        {isHovered && <StreamHoverIframe id={data.id} data={data} setIsHovered={setIsHovered} />}
        <Link
          to={{
            pathname: "/live/" + data.user_name.toLowerCase(),
            state: {
              p_uptime: data.started_at,
              p_title: data.title,
              p_game: data.game_name,
              p_viewers: data.viewers,
            },
          }}
          className={styles.img}>
          <img
            src={
              data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </Link>
        <Moment className={styles.duration} durationFromNow>
          {data.started_at}
        </Moment>
      </ImageContainer>
      {data.title.length > 50 ? (
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
              {data.title}
            </Tooltip>
          }>
          <VideoTitle
            to={{
              pathname: "/live/" + data.user_name.toLowerCase(),
              state: {
                p_uptime: data.started_at,
                p_title: data.title,
                p_game: data.game_name,
                p_viewers: data.viewers,
              },
            }}>
            {Util.truncate(data.title, 60)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: "/live/" + data.user_name.toLowerCase(),
            state: {
              p_uptime: data.started_at,
              p_title: data.title,
              p_game: data.game_name,
              p_viewers: data.viewers,
            },
          }}>
          {data.title}
        </VideoTitle>
      )}
      <div>
        <div className={styles.channelContainer} ref={refChannel}>
          <Link
            to={{
              pathname: `/channel/${data.user_name.toLowerCase()}`,
              state: {
                p_id: data.user_id,
              },
            }}
            style={{ gridRow: 1 }}>
            <img src={data.profile_img_url} alt='' className={styles.profile_img}></img>
          </Link>
          <Link
            to={{
              pathname: `/channel/${data.user_name.toLowerCase()}`,
              state: {
                p_id: data.user_id,
              },
            }}
            className={styles.channel}>
            {data.user_name}
          </Link>
        </div>
        <div className={styles.gameContainer}>
          <Link className={styles.game_img} to={"/game/" + data.game_name}>
            <img
              src={
                data.game_img
                  ? data.game_img.replace("{width}", 130).replace("{height}", 173)
                  : `${process.env.PUBLIC_URL}/images/placeholder.jpg`
              }
              alt=''
              className={styles.game_img}></img>
          </Link>
          <Link className={styles.game} to={"/game/" + data.game_name}>
            {data.game_name}
          </Link>
          <p className={styles.viewers}>
            {/* {data.viewer_count} */}
            {Util.formatViewerNumbers(data.viewer_count)}
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
    </VideoContainer>
  );
};
