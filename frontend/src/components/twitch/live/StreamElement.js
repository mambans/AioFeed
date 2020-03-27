import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { FaTwitch } from "react-icons/fa";

import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef, useState, useEffect, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { VideoTitle, ImageContainer, VideoContainer } from "./../../sharedStyledComponents";
import { ChannelNameDiv } from "./../StyledComponents";
import { FeedsContext } from "./../../feed/FeedsContext";
import StreamHoverIframe from "../StreamHoverIframe.js";
import styles from "./../Twitch.module.scss";
import Util from "../../../util/Util";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import VodsFollowUnfollowBtn from "./../vods/VodsFollowUnfollowBtn";

const HOVER_DELAY = 500; // 1000

function NewHighlightNoti({ data }) {
  if (data.newlyAddedStreams.includes(data.data.user_name.toLowerCase())) {
    return (
      <FiAlertCircle
        size={22}
        style={{
          position: "absolute",
          display: "flex",
          color: "var(--newHighlight)",
          backgroundColor: "#00000042",
          borderRadius: "8px",
          margin: "5px",
        }}
      />
    );
  }
  return "";
}

function StreamEle(data) {
  const [isHovered, setIsHovered] = useState(false);
  const { twitchVideoHoverEnable } = useContext(FeedsContext);

  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = () => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  };

  useEffect(() => {
    if (ref.current && twitchVideoHoverEnable) {
      const refEle = ref.current;
      refEle.addEventListener("mouseenter", handleMouseOver);
      refEle.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [twitchVideoHoverEnable]);

  return (
    <VideoContainer key={data.data.id}>
      <ImageContainer id={data.data.id} ref={ref} style={{ marginTop: "5px" }}>
        <NewHighlightNoti data={data}></NewHighlightNoti>
        {isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={setIsHovered}></StreamHoverIframe>
        ) : null}
        <Link
          className={styles.img}
          to={{
            pathname: "/live/" + data.data.user_name.toLowerCase(),
            state: {
              p_uptime: data.data.started_at,
              p_title: data.data.title,
              p_game: data.data.game_name,
              p_viewers: data.data.viewers,
            },
          }}>
          {/* href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.data.user_name.toLowerCase()
              }> */}
          <img
            style={
              data.newlyAddedStreams.includes(data.data.user_name)
                ? { boxShadow: "white 0px 0px 3px 2px" }
                : null
            }
            src={
              // data.data.thumbnail_url.replace("{width}", 1280).replace("{height}", 720) +
              data.data.thumbnail_url.replace("{width}", 858).replace("{height}", 480) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </Link>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
        {/* {streamType(data.data.type)} */}
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
            {Util.truncate(data.data.title, 60)}
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
            style={{ gridRow: 1, paddingRight: "5px" }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img} />
          </Link>
          <ChannelNameDiv>
            <Link
              to={{
                pathname: `/channel/${data.data.user_name.toLowerCase()}`,
                state: {
                  p_id: data.data.user_id,
                },
              }}
              className='name'>
              {data.data.user_name}
            </Link>
            {/* {channelIsHovered ? ( */}
            <a
              alt=''
              href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}
              className='twitchIcon'>
              <FaTwitch size={20} className />
            </a>
            {/* // ) : null} */}
          </ChannelNameDiv>
          <div style={{ display: "flex", gridRow: "1", justifyContent: "right" }}>
            <VodsFollowUnfollowBtn channel={data.data.user_name} marginright='7px;' />
            <FollowUnfollowBtn
              style={{
                gridRow: "1",
                justifySelf: "right",
                margin: "0",
                marginRight: "8px",
                height: "100%",
              }}
              size={22}
              channelName={data.data.user_name}
              id={data.data.user_id}
              alreadyFollowedStatus={true}
              refreshStreams={data.refresh}
            />
          </div>
        </div>
        <div className={styles.gameContainer}>
          <a
            className={styles.game_img}
            // href={"/twitch/top/" + data.data.game_name}
            href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
            <img
              src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
              alt=''
              className={styles.game_img}
            />
          </a>
          <Link
            className={styles.game}
            // href={"https://www.twitch.tv/directory/game/" + data.data.game_name}
            to={"/game/" + data.data.game_name}>
            {data.data.game_name}
          </Link>
          <p className={styles.viewers} title='Viewers'>
            {Util.formatViewerNumbers(data.data.viewer_count)}
            <FaRegEye
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
    </VideoContainer>
  );
}

export default StreamEle;
