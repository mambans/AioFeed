import { eye } from "react-icons-kit/icomoon/eye";
import { Icon } from "react-icons-kit";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";
import { VodLiveIndicator } from "./StyledComponents";
import AccountContext from "../../account/AccountContext";

export default ({ ...data }) => {
  const { twitchToken } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState();
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

  const handleMouseOver = useCallback(async () => {
    if (!previewAvailable) {
      hoverTimeoutRef.current = setTimeout(async () => {
        const res = await axios.get(`https://api.twitch.tv/kraken/videos/${data.data.id}`, {
          headers: {
            Authorization: `Bearer ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        });
        setIsHovered(true);
        if (res.data.status === "recorded" && data.data.thumbnail_url === "") {
          data.data.thumbnail_url = null;
        }
        if (res.data.status === "recording") {
          setPreviewAvailable("null");
        } else {
          setPreviewAvailable(res.data.animated_preview_url);
        }
      }, 500);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 200);
    }
  }, [previewAvailable, data.data.id, data.data.thumbnail_url, twitchToken]);

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
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        {data.data.thumbnail_url === "" ? (
          <VodLiveIndicator to={`/twitch/live/${data.data.user_name}`}>Live</VodLiveIndicator>
        ) : null}
        <a className={styles.img} href={data.data.url}>
          {isHovered && previewAvailable && previewAvailable !== "null" ? (
            <div
              alt=''
              className={styles.vodPreview}
              style={{
                width: "336px",
                height: "189px",
                backgroundImage: `url(${previewAvailable})`,
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
          <VideoTitle to={`/twitch/video/${data.data.id}#${data.data.user_name}`}>
            {Utilities.truncate(data.data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={`/twitch/video/${data.data.id}#${data.data.user_name}`}>
          {data.data.title}
        </VideoTitle>
      )}

      <div>
        <div className={styles.channelContainer} style={{ marginBottom: "0px", height: "25px" }}>
          <Link
            to={"/twitch/channel/" + data.data.user_name.toLowerCase()}
            className={styles.channel}>
            {data.data.user_name}
          </Link>
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
