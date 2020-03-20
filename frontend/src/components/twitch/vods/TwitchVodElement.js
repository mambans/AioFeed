import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";
import styles from "../Twitch.module.scss";
import Util from "../../../util/Util";
import { VodLiveIndicator, VodType } from "./StyledComponents";
import VodsFollowUnfollowBtn from "./VodsFollowUnfollowBtn";

export default ({ data, vodBtnDisabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState();
  const imgRef = useRef();
  const hoverTimeoutRef = useRef();

  const handleMouseOver = useCallback(async () => {
    if (!previewAvailable) {
      hoverTimeoutRef.current = setTimeout(async () => {
        const res = await axios.get(`https://api.twitch.tv/kraken/videos/${data.id}`, {
          headers: {
            Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        });
        setIsHovered(true);
        if (res.data.status === "recorded" && data.thumbnail_url === "") {
          data.thumbnail_url = null;
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
  }, [previewAvailable, data.id, data.thumbnail_url]);

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
        {data.thumbnail_url === "" ? (
          <VodLiveIndicator to={`/live/${data.user_name}`}>Live</VodLiveIndicator>
        ) : null}
        <a className={styles.img} href={data.url}>
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
                data.thumbnail_url
                  ? data.thumbnail_url.replace("%{width}", 640).replace("%{height}", 360)
                  : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
              }
              alt={styles.thumbnail}
            />
          )}
        </a>

        <div className={styles.vodVideoInfo}>
          <p className={styles.vodDuration} title='duration'>
            {data.thumbnail_url === "" ? (
              <Moment durationFromNow>{data.created_at}</Moment>
            ) : (
              Util.formatTwitchVodsDuration(data.duration)
            )}
          </p>
          <p className={styles.view_count} title='views'>
            {Util.formatViewerNumbers(data.view_count)}
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
        {data.type !== "archive" ? (
          <VodType>
            <span>{data.type}</span>
          </VodType>
        ) : null}
      </ImageContainer>
      {data.title.length > 50 ? (
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
              {data.title}
            </Tooltip>
          }>
          <VideoTitle
            to={{
              pathname: `/video/${data.id}#${data.user_name}`,
              state: {
                p_title: data.title,
                p_channel: data.user_name,
              },
            }}>
            {Util.truncate(data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: `/video/${data.id}#${data.user_name}`,
            state: {
              p_title: data.title,
              p_channel: data.user_name,
            },
          }}>
          {data.title}
        </VideoTitle>
      )}

      <div className={styles.channelContainer}>
        <Link
          to={{
            pathname: `/channel/${data.user_name.toLowerCase()}`,
            state: {
              p_id: data.user_id,
            },
          }}
          style={{ gridRow: 1, paddingRight: "5px" }}>
          <img src={data.profile_img_url} alt='' className={styles.profile_img} />
        </Link>
        <div style={{ display: "flex" }}>
          <Link
            to={{
              pathname: `/channel/${data.user_name.toLowerCase()}`,
              state: {
                p_id: data.user_id,
              },
            }}
            className={styles.channel}>
            {data.user_name}
          </Link>
          {vodBtnDisabled ? null : (
            <VodsFollowUnfollowBtn channel={data.user_name} lowerOpacity='0.5' />
          )}
        </div>
        <div className={styles.vodDates}>
          <div>
            <Moment
              interval={300000}
              durationFromNow
              className={styles.date}
              id={styles.timeago}
              style={{
                gridColumn: 2,
                justifySelf: "right",
              }}>
              {data.thumbnail_url === "" ? data.created_at : data.endDate}
            </Moment>
            <p
              className={styles.viewers}
              id={styles.time}
              style={{
                gridColumn: 2,
                justifySelf: "right",
              }}>
              {`${moment(data.created_at).format("dd HH:mm")} → ${
                data.thumbnail_url === ""
                  ? moment(new Date()).format("dd HH:mm")
                  : moment(data.endDate).format("dd HH:mm")
              }`}
            </p>
          </div>
        </div>
      </div>
    </VideoContainer>
  );
};
