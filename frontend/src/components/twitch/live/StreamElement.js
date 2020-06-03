import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { FaTwitch } from "react-icons/fa";

import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef, useState, useEffect, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { useLocation } from "react-router-dom";

import {
  VideoTitle,
  ImageContainer,
  VideoContainer,
  ChannelContainer,
  GameContainer,
} from "./../../sharedStyledComponents";
import { ChannelNameDiv } from "./../StyledComponents";
import FeedsContext from "./../../feed/FeedsContext";
import StreamHoverIframe from "../StreamHoverIframe.js";
import { truncate } from "../../../util/Utils";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import VodsFollowUnfollowBtn from "./../vods/VodsFollowUnfollowBtn";
import { formatViewerNumbers } from "./../TwitchUtils";
import AddUpdateNotificationsButton from "../AddUpdateNotificationsButton";

const HOVER_DELAY = 100;

function NewHighlightNoti({ newlyAddedStreams, user_name }) {
  if (newlyAddedStreams && newlyAddedStreams.includes(user_name.toLowerCase())) {
    return (
      <FiAlertCircle
        size={22}
        style={{
          position: "absolute",
          display: "flex",
          color: "var(--newHighlightColor)",
          backgroundColor: "#00000042",
          borderRadius: "8px",
          margin: "5px",
        }}
      />
    );
  }
  return "";
}

export default (data_p) => {
  const location = useLocation();
  const { data, newlyAddedStreams, refresh, refreshAfterUnfollowTimer } = data_p;
  const [isHovered, setIsHovered] = useState(false);
  const { twitchVideoHoverEnable } = useContext(FeedsContext);

  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  useEffect(() => {
    const handleMouseOver = () => {
      streamHoverTimer.current = setTimeout(function () {
        setIsHovered(true);
      }, HOVER_DELAY);
    };

    const handleMouseOut = () => {
      clearTimeout(streamHoverTimer.current);
      setIsHovered(false);
    };

    if (ref.current && twitchVideoHoverEnable) {
      const refEle = ref.current;
      refEle.addEventListener("mouseenter", handleMouseOver);
      refEle.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [twitchVideoHoverEnable, data.user_name]);

  return (
    <VideoContainer key={data.user_id}>
      <ImageContainer id={data.user_id} ref={ref} style={{ marginTop: "5px" }}>
        <NewHighlightNoti
          newlyAddedStreams={newlyAddedStreams}
          user_name={data.user_name}></NewHighlightNoti>
        {isHovered && (
          <StreamHoverIframe id={data.user_id} data={data} setIsHovered={setIsHovered} />
        )}
        <Link
          to={{
            pathname: "/" + data.user_name.toLowerCase(),
            state: {
              p_uptime: data.started_at,
              p_title: data.title,
              p_game: data.game_name,
              p_viewers: data.viewers,
            },
          }}>
          {/* href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.user_name.toLowerCase()
              }> */}
          <img
            alt=''
            style={
              newlyAddedStreams && newlyAddedStreams.includes(data.user_name)
                ? { boxShadow: "white 0px 0px 3px 2px" }
                : null
            }
            src={
              // data.thumbnail_url.replace("{width}", 1280).replace("{height}", 720) +
              data.thumbnail_url
                ? data.thumbnail_url.replace("{width}", 858).replace("{height}", 480) +
                  `#` +
                  Date.now()
                : `${process.env.PUBLIC_URL}/images/placeholder.webp`
            }
          />
        </Link>
        <Moment interval={1} className={"duration"} durationFromNow>
          {data.started_at}
        </Moment>
        {/* {streamType(data.data.type)} */}
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
              pathname: "/" + data.user_name.toLowerCase(),
              state: {
                p_uptime: data.started_at,
                p_title: data.title,
                p_game: data.game_name,
                p_viewers: data.viewers,
              },
            }}>
            {truncate(data.title, 60)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: "/" + data.user_name.toLowerCase(),
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
        <ChannelContainer ref={refChannel}>
          <Link
            to={{
              pathname: `/${data.user_name.toLowerCase()}/channel`,
              state: {
                p_id: data.user_id,
              },
            }}
            style={{ gridRow: 1, paddingRight: "5px" }}>
            <img src={data.profile_img_url} alt='' className={"profileImg"} />
          </Link>
          <ChannelNameDiv>
            <Link
              to={{
                pathname: `/${data.user_name.toLowerCase()}/channel`,
                state: {
                  p_id: data.user_id,
                },
              }}
              className='channelName'>
              {data.user_name}
            </Link>
            <a
              alt=''
              href={"https://www.twitch.tv/" + data.user_name.toLowerCase()}
              className='twitchIcon'>
              <FaTwitch size={20} />
            </a>
          </ChannelNameDiv>
          {(location.pathname === "/feed/" || location.pathname === "/feed") && (
            <div style={{ display: "flex", gridRow: "1", justifyContent: "right" }}>
              <VodsFollowUnfollowBtn channel={data.user_name} marginright='5px;' />
              <AddUpdateNotificationsButton channel={data.user_name} marginright='5px;' />
              <FollowUnfollowBtn
                style={{
                  gridRow: "1",
                  justifySelf: "right",
                  margin: "0",
                  marginRight: "8px",
                  height: "100%",
                }}
                size={22}
                channelName={data.user_name}
                id={data.user_id}
                alreadyFollowedStatus={true}
                refreshStreams={refresh}
                refreshAfterUnfollowTimer={refreshAfterUnfollowTimer}
              />
            </div>
          )}
        </ChannelContainer>

        <GameContainer>
          {data.game_img && (
            <a
              className={"gameImg"}
              href={"https://www.twitch.tv/directory/category/" + data.game_name}>
              <img
                src={data.game_img.replace("{width}", 130).replace("{height}", 173)}
                alt=''
                className={"gameImg"}
              />
            </a>
          )}
          {data.game_name && (
            <Link className={"gameName"} to={"/category/" + data.game_name}>
              {data.game_name}
            </Link>
          )}

          <p title='Viewers' className='viewers'>
            {formatViewerNumbers(data.viewer_count)}
            <FaRegEye size={14} />
          </p>
        </GameContainer>
      </div>
    </VideoContainer>
  );
};
