import { CSSTransition } from "react-transition-group";
import { FaRegClock } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "styled-components";

import { SidebarTitlePopup, StyledsidebarItem, FirstRow, SecondRow } from "./StyledComponents";
import { truncate } from "../../../util/Utils";
import { formatViewerNumbers } from "./../TwitchUtils";

const StyledNewHighlight = styled.div`
  position: absolute;
  left: 0;
  height: 62px;
  width: 4px;
  border-radius: 2px;
  background: var(--newHighlightColor);
`;

const NewHighlight = ({ newlyAdded, stream }) => {
  if (newlyAdded.includes(stream.user_name)) {
    return <StyledNewHighlight />;
  } else {
    return "";
  }
};

const SidebarItem = ({ stream, newlyAdded, shows, setShows }) => {
  const [showTitle, setShowTitle] = useState();
  const ref = useRef();
  const timerRef = useRef();

  const handleMouseOver = useCallback(() => {
    setShowTitle(shows);
    timerRef.current = setTimeout(() => {
      setShowTitle(true);
      setShows(true);
    }, 1000);
  }, [setShows, shows]);

  const handleMouseOut = useCallback(() => {
    clearTimeout(timerRef.current);
    setShowTitle(false);
  }, []);

  useEffect(() => {
    const refEle = ref.current;
    refEle.addEventListener("mouseenter", handleMouseOver);
    refEle.addEventListener("mouseleave", handleMouseOut);

    return () => {
      refEle.removeEventListener("mouseenter", handleMouseOver);
      refEle.removeEventListener("mouseleave", handleMouseOut);
      clearTimeout(timerRef.current);
    };
  }, [handleMouseOut, handleMouseOver]);

  return (
    <Link
      ref={ref}
      to={"/" + stream.user_name.toLowerCase()}
      style={{ display: "flex", flexDirection: "column" }}>
      {/* <div className={styles.sidebarItems} key={data.stream.id}> */}
      <StyledsidebarItem key={stream.id} duration={shows}>
        <NewHighlight newlyAdded={newlyAdded} stream={stream}></NewHighlight>

        <div
          className={"profileImage"}
          // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
        >
          <img
            src={
              stream.profile_img_url
                ? stream.profile_img_url.replace("{width}", 640).replace("{height}", 360) +
                  `#` +
                  Date.now()
                : `${process.env.PUBLIC_URL}/android-chrome-512x512.png`
            }
            alt=''></img>
        </div>
        <FirstRow>
          <div
            className={"sidebarUser"}
            // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
          >
            {truncate(stream.user_name, 16)}
          </div>
          <p className={"sidebarViewers"}>
            {formatViewerNumbers(stream.viewer_count)}
            <FaRegEye size={10} />
          </p>
        </FirstRow>
        <SecondRow>
          {stream.game_name.length > 15 ? (
            <OverlayTrigger
              key={"bottom"}
              placement={"bottom"}
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip
                  id={`tooltip-${"bottom"}`}
                  style={{
                    width: "275px",
                  }}>
                  {stream.game_name}
                </Tooltip>
              }>
              <p className={"sidebarGame"}>{stream.game_name}</p>
            </OverlayTrigger>
          ) : (
            <div
              className={"sidebarGame"}
              // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
            >
              <p>{truncate(stream.game_name, 15)}</p>
            </div>
          )}
          <div className={"sidebarDuration"}>
            <Moment durationFromNow>{stream.started_at}</Moment>
            <FaRegClock size={9} />
          </div>
        </SecondRow>
      </StyledsidebarItem>
      <CSSTransition
        in={showTitle}
        key={stream.id + stream.title}
        timeout={1000}
        classNames='sidebarTitlePopup'
        unmountOnExit>
        <SidebarTitlePopup>
          <div className='borderTop'></div>
          <span>{stream.title}</span>
          <div className='borderBottom'></div>
        </SidebarTitlePopup>
      </CSSTransition>
    </Link>
  );
};

export default SidebarItem;
