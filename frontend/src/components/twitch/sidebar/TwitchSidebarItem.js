import { CSSTransition } from "react-transition-group";
import { FaRegClock } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { SidebarTitlePopup } from "./StyledComponents";
import styles from "./../Twitch.module.scss";
import Util from "../../../util/Util";

const NewHighlight = ({ data }) => {
  if (data.newlyAdded.includes(data.stream.user_name)) {
    return <div className={styles.newHighlight}></div>;
  } else {
    return "";
  }
};

const TwitchSidebarItem = data => {
  const [showTitle, setShowTitle] = useState();
  const ref = useRef();
  const timerRef = useRef();

  const handleMouseOver = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setShowTitle(true);
    }, 1200);
  }, []);

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
      to={"/live/" + data.stream.user_name.toLowerCase()}
      style={{ display: "flex", flexDirection: "column" }}>
      <div className={styles.sidebarItems} key={data.stream.id}>
        <NewHighlight data={data}></NewHighlight>

        <div
          className={styles.profileImage}
          // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
        >
          <img
            src={
              data.stream.profile_img_url
                ? data.stream.profile_img_url.replace("{width}", 640).replace("{height}", 360) +
                  `#` +
                  new Date().getTime()
                : `${process.env.PUBLIC_URL}/android-chrome-512x512.png`
            }
            alt={styles.thumbnail}></img>
        </div>
        <div
          className={styles.sidebarUser}
          // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
        >
          {Util.truncate(data.stream.user_name, 16)}
        </div>
        <p className={styles.sidebarViewers}>
          {Util.formatViewerNumbers(data.stream.viewer_count)}
          <FaRegEye
            size={10}
            style={{
              color: "rgb(120, 120, 120)",
              // paddingLeft: "5px",
              display: "flex",
              alignItems: "center",
            }}
          />
        </p>
        <div className={styles.rowTwo}>
          {data.stream.game_name.length > 15 ? (
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
                  {data.stream.game_name}
                </Tooltip>
              }>
              <p className={styles.sidebarGame}>{data.stream.game_name}</p>
            </OverlayTrigger>
          ) : (
            <div
              className={styles.sidebarGame}
              // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
            >
              <p>{Util.truncate(data.stream.game_name, 15)}</p>
            </div>
          )}
          <div className={styles.sidebarDuration}>
            <Moment durationFromNow>{data.stream.started_at}</Moment>
            <FaRegClock
              size={9}
              style={{
                color: "rgb(120, 120, 120)",
                // paddingLeft: "5px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </div>
        </div>
      </div>
      <CSSTransition
        in={showTitle}
        key={data.stream.id + data.stream.title}
        timeout={1500}
        classNames='sidebarTitlePopup'
        unmountOnExit>
        <SidebarTitlePopup>
          <div className='borderTop'></div>
          <span>{data.stream.title}</span>
          <div className='borderBottom'></div>
        </SidebarTitlePopup>
      </CSSTransition>
    </Link>
  );
};

export default TwitchSidebarItem;
