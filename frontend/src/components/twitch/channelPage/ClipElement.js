import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Util from "../../../util/Util";

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
            {Util.formatViewerNumbers(data.data.view_count)}
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
            {Util.truncate(data.data.title, 70)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={`/clip/${data.data.id}#${data.user_name || data.data.broadcaster_name}`}>
          {data.data.title}
        </VideoTitle>
      )}

      <div style={{ width: "336px" }}>
        <div className={styles.channelContainer}>
          <Link
            to={{
              pathname: `/channel/${data.data.broadcaster_name.toLowerCase()}`,
              state: {
                p_id: data.data.broadcaster_id,
              },
            }}
            style={{ gridRow: 1, paddingRight: "5px" }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img} />
          </Link>
          <Link
            to={"/channel/" + data.data.broadcaster_name.toLowerCase()}
            className={styles.channel}>
            {data.data.broadcaster_name}
          </Link>
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
          <Moment
            className={styles.viewers}
            id={styles.timeago}
            style={{
              color: "var(--infoColorGrey)",
              gridColumn: 3,
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