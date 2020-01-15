import axios from "axios";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import { eye } from "react-icons-kit/icomoon/eye";
import { Icon } from "react-icons-kit";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

export default ({ ...data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState(null);
  const imgRef = useRef();
  const hoverTimeoutRef = useRef();

  const durationToMs = duration => {
    const hms = Utilities.formatTwitchVodsDuration(duration); // your input string
    const a = hms.split(":"); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    const ms = seconds * 1000;

    return ms;
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

  const vodPreview = `https://static-cdn.jtvnw.net/s3_vods/${
    data.data.thumbnail_url.split("/")[4]
  }/storyboards/${data.data.id}-strip-0.jpg`;

  const checkVodPreviewAvailability = useCallback(async () => {
    const Availability = await axios
      .get(vodPreview)
      .then(() => {
        setPreviewAvailable(true);
        return true;
      })
      .catch(() => {
        setPreviewAvailable(false);
        return false;
      });

    return Availability;
  }, [vodPreview]);

  const handleMouseOver = useCallback(() => {
    if (previewAvailable === null) {
      checkVodPreviewAvailability();
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
    // setIsHovered(true);
  }, [checkVodPreviewAvailability, previewAvailable]);

  const handleMouseOut = useCallback(event => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const refEle = imgRef.current;
    imgRef.current.addEventListener("mouseenter", handleMouseOver);
    imgRef.current.addEventListener("mouseleave", handleMouseOut);

    return () => {
      refEle.removeEventListener("mouseenter", handleMouseOver);
      refEle.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [handleMouseOut, handleMouseOver]);

  return (
    <VideoContainer
    // onTransitionEnd={() => {
    //   if (data.transition !== "videoFade-1s") data.setTransition();
    // }}
    >
      <ImageContainer ref={imgRef}>
        <a className={styles.img} href={data.data.url}>
          {isHovered && data.data.thumbnail_url && previewAvailable ? (
            <div
              alt=''
              className={styles.vodPreview}
              style={{
                width: "336px",
                height: "189px",
                backgroundImage: `url(${vodPreview})`,
                borderRadius: "10px",
              }}></div>
          ) : (
            <img
              src={
                data.data.thumbnail_url
                  ? data.data.thumbnail_url.replace("%{width}", 640).replace("%{height}", 360)
                  : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
              }
              alt={styles.thumbnail}
            />
          )}
        </a>
        <div className={styles.vodVideoInfo}>
          <p className={styles.vodDuration} title='duration'>
            {Utilities.formatTwitchVodsDuration(data.data.duration)}
          </p>
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
          <VideoTitle href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
            {Utilities.truncate(data.data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {data.data.title}
        </VideoTitle>
      )}

      <div>
        <div className={styles.channelContainer} style={{ marginBottom: "0px", height: "25px" }}>
          <p className={styles.channel} style={{ paddingLeft: "5px" }}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
              {data.data.user_name}
            </a>
          </p>
        </div>
        <div
          className={styles.gameContainer}
          style={{ gridTemplateColumns: "40% 60%", color: "#979797" }}>
          <p className={styles.game} style={{ gridColumn: 1, paddingLeft: "5px" }}>
            {data.data.type}
          </p>

          <div className={styles.vodDates}>
            <div>
              <Moment
                className={styles.viewers}
                id={styles.timeago}
                style={{
                  gridColumn: 2,
                  justifySelf: "right",
                }}
                fromNow>
                {data.data.endDate}
              </Moment>
              <p
                className={styles.viewers}
                id={styles.time}
                style={{
                  gridColumn: 2,
                  justifySelf: "right",
                }}>
                {moment(
                  new Date(new Date(data.data.endDate).getTime() - durationToMs(data.data.duration))
                ).format("dd HH:MM") +
                  "→" +
                  moment(data.data.endDate).format("dd HH:MM")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </VideoContainer>
  );
};
