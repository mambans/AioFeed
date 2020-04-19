import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import {
  VideoContainer,
  VideoTitle,
  ImageContainer,
  VodVideoInfo,
  ChannelContainer,
  StyledVideoElementAlert,
} from "./../../sharedStyledComponents";
import Util from "../../../util/Util";
import { VodLiveIndicator, VodType, VodPreview, VodDates } from "./StyledComponents";
import VodsFollowUnfollowBtn from "./VodsFollowUnfollowBtn";

export default ({ data, vodBtnDisabled }) => {
  const [previewAvailable, setPreviewAvailable] = useState({});
  const [showPreview, setShowPreview] = useState();
  const imgRef = useRef();
  const hoverTimeoutRef = useRef();

  const handleMouseOver = useCallback(async () => {
    if (!previewAvailable.data) {
      hoverTimeoutRef.current = setTimeout(
        async () => {
          await axios
            .get(`https://api.twitch.tv/kraken/videos/${data.id}`, {
              headers: {
                Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                Accept: "application/vnd.twitchtv.v5+json",
              },
            })
            .then((res) => {
              console.log("handleMouseOver -> res", res.data.preview);
              if (res.data.status === "recording") {
                setPreviewAvailable({
                  status: "recording",
                  error: "Stream is live - no preview yet",
                });
              } else {
                if (data.thumbnail_url === "") data.thumbnail_url = res.data.preview.template;
                setPreviewAvailable({
                  data: res.data.animated_preview_url,
                });
              }
              setShowPreview(true);
            })
            .catch((error) => {
              setPreviewAvailable({ error: "Preview failed" });
              console.error(error);
            });
        },
        previewAvailable.error ? 5000 : 1000
      );
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 250);
    }
  }, [data.id, previewAvailable.error, previewAvailable.data, data.thumbnail_url]);

  const handleMouseOut = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setShowPreview(false);
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
        {previewAvailable.error && (
          <StyledVideoElementAlert variant='danger' className='error'>
            {previewAvailable.error}
          </StyledVideoElementAlert>
        )}
        {data.thumbnail_url === "" && (
          <VodLiveIndicator to={`/${data.user_name}`}>Live</VodLiveIndicator>
        )}
        <a href={data.url}>
          {!previewAvailable.error && !previewAvailable.data && (
            <Spinner className='loadingSpinner' animation='border' role='status' variant='light' />
          )}
          {previewAvailable.data && showPreview && (
            <VodPreview previewAvailable={previewAvailable.data} className='VodPreview' />
          )}
          <img
            src={
              data.thumbnail_url
                ? data.thumbnail_url.replace("%{width}", 640).replace("%{height}", 360)
                : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
            }
            alt=''
          />
        </a>

        <VodVideoInfo>
          <p className={"vodDuration"} title='duration'>
            {data.thumbnail_url === "" ? (
              <Moment durationFromNow>{data.created_at}</Moment>
            ) : (
              Util.formatTwitchVodsDuration(data.duration)
            )}
          </p>
          <p className={"view_count"} title='views'>
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
        </VodVideoInfo>
        {data.type !== "archive" && (
          <VodType>
            <span>{data.type}</span>
          </VodType>
        )}
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
              pathname: `/${data.user_name}/video/${data.id}`,
              state: {
                p_title: data.title,
              },
            }}>
            {Util.truncate(data.title, 70)}
            {/* {data.data.title} */}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: `/${data.user_name}/video/${data.id}`,
            state: {
              p_title: data.title,
            },
          }}>
          {data.title}
        </VideoTitle>
      )}
      <ChannelContainer>
        <Link
          to={{
            pathname: `/${data.user_name.toLowerCase()}/channel`,
            state: {
              p_id: data.user_id,
            },
          }}
          style={{ gridRow: 1, paddingRight: "5px" }}>
          <img src={data.profile_img_url} alt='' className={"profileImg"} />
        </Link>
        <div style={{ display: "flex" }}>
          <Link
            to={{
              pathname: `/${data.user_name.toLowerCase()}/channel`,
              state: {
                p_id: data.user_id,
              },
            }}
            className={"channelName"}>
            {data.user_name}
          </Link>
          {vodBtnDisabled ? null : (
            <VodsFollowUnfollowBtn channel={data.user_name} loweropacity='0.5' />
          )}
        </div>
        <VodDates>
          <div>
            <Moment
              interval={300000}
              durationFromNow
              className={"date"}
              id={"timeago"}
              style={{
                gridColumn: 2,
                justifySelf: "right",
              }}>
              {data.thumbnail_url === "" ? data.created_at : data.endDate}
            </Moment>
            <p
              id={"time"}
              className='viewers'
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
        </VodDates>
      </ChannelContainer>
    </VideoContainer>
  );
};
