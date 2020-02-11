import React from "react";
import Moment from "react-moment";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/icomoon/eye";
import { clock } from "react-icons-kit/icomoon/clock";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

const NewHighlight = ({ data }) => {
  if (data.newlyAdded.includes(data.stream.user_name)) {
    return <div className={styles.newHighlight}></div>;
  } else {
    return "";
  }
};

const formatViewerNumbers = viewers => {
  if (viewers.toString().length === 7) {
    return (viewers / 1000000).toString().substring(0, 5) + "m";
  } else if (viewers.toString().length >= 5) {
    return viewers.toString().substring(0, viewers.toString().length - 3) + "k";
  } else {
    return viewers;
  }
};

const TwitchSidebarItem = data => {
  return (
    <Nav.Link
      as={NavLink}
      to={"/twitch/live/" + data.stream.user_name.toLowerCase()}
      style={{ position: "relative", display: "flex", flexDirection: "column", padding: "0" }}>
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
          {Utilities.truncate(data.stream.user_name, 16)}
        </div>
        <p className={styles.sidebarViewers}>
          {formatViewerNumbers(data.stream.viewer_count)}
          <Icon
            icon={eye}
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
              <p>{Utilities.truncate(data.stream.game_name, 15)}</p>
            </div>
          )}
          <div className={styles.sidebarDuration}>
            <Moment durationFromNow>{data.stream.started_at}</Moment>
            <Icon
              icon={clock}
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
    </Nav.Link>
  );
};

export default TwitchSidebarItem;
