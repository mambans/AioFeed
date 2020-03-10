import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

export default ({ ...data }) => {
  const imgRef = useRef();

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        <a
          className={styles.img}
          // href={data.data.embed_url}
          href={`https://www.twitch.tv/${data.user_name || data.data.broadcaster_name}/clip/${
            data.data.id
          }`}>
          <img src={data.data.thumbnail_url} alt={styles.thumbnail} />
        </a>
        <div className={styles.vodVideoInfo}>
          <p className={styles.vodDuration} title='duration'></p>
          <p className={styles.view_count} title='views'>
            {Utilities.formatViewerNumbers(data.data.view_count)}
            <FaRegEye
              size={10}
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
          <VideoTitle to={`/clip/${data.data.id}#${data.user_name || data.data.broadcaster_name}`}>
            {Utilities.truncate(data.data.title, 70)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={`/clip/${data.data.id}#${data.user_name || data.data.broadcaster_name}`}>
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
              color: "var(--infoColorGrey)",
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
