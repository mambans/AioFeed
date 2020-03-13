import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Util from "../../../util/Util";
import { VodLiveIndicator } from "./StyledComponents";
import { Spinner } from "react-bootstrap";

export default ({ ...data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState();
  const imgRef = useRef();
  const hoverTimeoutRef = useRef();

  const durationToMs = duration => {
    const hms = Util.formatTwitchVodsDuration(duration);
    const parts = hms.split(":");
    const seconds = +parts[0] * 60 * 60 + +parts[1] * 60 + +parts[2];
    const ms = seconds * 1000;

    return ms;
  };

  const handleMouseOver = useCallback(async () => {
    if (!previewAvailable) {
      hoverTimeoutRef.current = setTimeout(async () => {
        const res = await axios.get(`https://api.twitch.tv/kraken/videos/${data.data.id}`, {
          headers: {
            Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
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
      }, 1000);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 200);
    }
  }, [previewAvailable, data.data.id, data.data.thumbnail_url]);

  const handleMouseOut = useCallback(event => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const refEle = imgRef.current;
    refEle.addEventListener("mouseenter", handleMouseOver);
    refEle.addEventListener("mouseleave", handleMouseOut);

    return () => {
      refEle.removeEventListener("mouseenter", handleMouseOver);
      refEle.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [handleMouseOut, handleMouseOver]);

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        {data.data.thumbnail_url === "" ? (
          <VodLiveIndicator to={`/live/${data.data.user_name}`}>Live</VodLiveIndicator>
        ) : null}
        <a className={styles.img} href={data.data.url}>
          {!previewAvailable ? (
            <Spinner className='loadingSpinner' animation='border' role='status' variant='light' />
          ) : null}
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
            {Util.formatTwitchVodsDuration(data.data.duration)}
          </p>
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
          <VideoTitle
            to={{
              pathname: `/video/${data.data.id}#${data.data.user_name}`,
              state: {
                p_title: data.data.title,
                p_channel: data.data.user_name,
              },
            }}>
            {Util.truncate(data.data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: `/video/${data.data.id}#${data.data.user_name}`,
            state: {
              p_title: data.data.title,
              p_channel: data.data.user_name,
            },
          }}>
          {data.data.title}
        </VideoTitle>
      )}

      <div>
        <div className={styles.channelContainer}>
          <Link
            to={{
              pathname: `/channel/${data.data.user_name.toLowerCase()}`,
              state: {
                p_id: data.data.user_id,
              },
            }}
            style={{ gridRow: 1, paddingRight: "5px" }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img} />
          </Link>
          <Link
            to={{
              pathname: `/channel/${data.data.user_name.toLowerCase()}`,
              state: {
                p_id: data.data.user_id,
              },
            }}
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
                {data.data.endDate || data.data.created_at}
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
