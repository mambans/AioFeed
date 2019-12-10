import { store } from "react-notifications-component";
import axios from "axios";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import Utilities from "../../../utilities/Utilities";
import styles from "../Twitch.module.scss";
import { VideoContainer, VideoTitle, ImageContainer } from "./../../sharedStyledComponents";

function TwitchVodElement(data) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvailable, setPreviewAvailable] = useState(null);
  const ref = useRef();
  const hoverTimeoutRef = useRef();

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
    const refEle = ref.current;
    ref.current.addEventListener("mouseenter", handleMouseOver);
    ref.current.addEventListener("mouseleave", handleMouseOut);

    return () => {
      refEle.removeEventListener("mouseenter", handleMouseOver);
      refEle.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [handleMouseOut, handleMouseOver]);

  return (
    <VideoContainer>
      <ImageContainer ref={ref}>
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
                  ? data.data.thumbnail_url.replace("%{width}", 858).replace("%{height}", 480)
                  : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
              }
              alt={styles.thumbnail}
            />
          )}
        </a>
        <p className={styles.duration}>{Utilities.formatTwitchVodsDuration(data.data.duration)}</p>
      </ImageContainer>
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
          {Utilities.truncate(data.data.title, 50)}
        </VideoTitle>
      </OverlayTrigger>

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
          style={{ gridTemplateColumns: "50% 50%", color: "#979797" }}>
          <p className={styles.game} style={{ gridColumn: 1, paddingLeft: "5px" }}>
            {data.data.type}
          </p>
          <Moment
            className={styles.viewers}
            style={{
              gridColumn: 2,
              justifySelf: "right",
            }}
            fromNow>
            {data.data.endDate}
          </Moment>
        </div>
      </div>
    </VideoContainer>
  );
}

function RenderTwitchVods(data) {
  const vodData = useRef();

  const addNotification = useCallback(
    (title, type) => {
      store.addNotification({
        content: (
          <div className={`notification-custom-${type}`}>
            <div className='notification-custom-icon'></div>
            <div className='notification-custom-content'>
              <p className='notification-title'>{title}</p>
              <p className='notification-message'>{Utilities.truncate(data.data.title, 50)}</p>
              <p className='notification-game'>{data.data.game_name}</p>
            </div>
          </div>
        ),
        width: 350,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "slideInRight"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000,
        },
      });
    },
    [data.data.game_name, data.data.title]
  );

  useEffect(() => {
    vodData.current = data.data;
    data.runChange(false);
  }, [
    addNotification,
    data,
    data.data.game_name,
    data.data.profile_img_url,
    data.data.title,
    data.data.user_name,
  ]);

  return <TwitchVodElement data={data.data} />;
}

export default RenderTwitchVods;
