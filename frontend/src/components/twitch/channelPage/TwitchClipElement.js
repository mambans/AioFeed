import { eye } from "react-icons-kit/icomoon/eye";
import { Icon } from "react-icons-kit";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

export default ({ ...data }) => {
  const imgRef = useRef();

  const formatViewerNumbers = viewers => {
    if (viewers.toString().length === 7) {
      return (viewers / 1000000).toString().substring(0, 5) + "m";
    } else if (viewers.toString().length >= 5) {
      return viewers.toString().substring(0, viewers.toString().length - 3) + "k";
    } else {
      return viewers;
    }
  };

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        <a
          className={styles.img}
          // href={data.data.embed_url}
          href={`https://www.twitch.tv/${data.user_name}/clip/${data.data.id}`}>
          <img src={data.data.thumbnail_url} alt={styles.thumbnail} />
        </a>
        <div className={styles.vodVideoInfo}>
          <p className={styles.vodDuration} title='duration'></p>
          <p className={styles.view_count} title='views'>
            {formatViewerNumbers(data.data.view_count)}
            <Icon
              icon={eye}
              size={10}
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
                width: "320px",
              }}>
              {data.data.title}
            </Tooltip>
          }>
          <VideoTitle to={"/clip/" + data.data.id + `#${data.user_name}`}>
            {Utilities.truncate(data.data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={"/clip/" + data.data.id + `#${data.user_name}`}>
          {data.data.title}
        </VideoTitle>
      )}

      <div style={{ width: "336px" }}>
        <div className={styles.channelContainer} style={{ marginBottom: "0px", height: "25px" }}>
          <Link
            to={"/channel/" + data.data.broadcaster_name.toLowerCase()}
            className={styles.channel}>
            {data.data.broadcaster_name}
          </Link>
          <Moment
            className={styles.viewers}
            id={styles.timeago}
            style={{
              gridColumn: 2,
              justifySelf: "right",
            }}
            fromNow>
            {data.data.created_at}
          </Moment>
        </div>
      </div>
    </VideoContainer>
  );
};
