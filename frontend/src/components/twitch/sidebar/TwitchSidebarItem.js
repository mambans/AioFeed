import React from "react";
import Moment from "react-moment";
import { FaRegEye } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

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
  return (
    <Link
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
    </Link>
  );
};

export default TwitchSidebarItem;
