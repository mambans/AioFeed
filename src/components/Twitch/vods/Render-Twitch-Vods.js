import React, { useEffect, useRef, useCallback, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { store } from "react-notifications-component";
import Moment from "react-moment";
import axios from "axios";

import styles from "../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

function TwitchVodElement(data) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewAvalible, setPreviewAvalible] = useState(null);
  const ref = useRef();
  const hoverTimeoutRef = useRef();

  const vodPreview = `https://static-cdn.jtvnw.net/s3_vods/${
    data.data.thumbnail_url.split("/")[4]
  }/storyboards/${data.data.id}-strip-0.jpg`;

  const checkVodPreviewAvailability = useCallback(async () => {
    const Availability = await axios
      .get(vodPreview)
      .then(() => {
        setPreviewAvalible(true);
        return true;
      })
      .catch(() => {
        setPreviewAvalible(false);
        return false;
      });
    console.log(Availability);

    return Availability;
  }, [vodPreview]);

  const handleMouseOver = useCallback(() => {
    if (previewAvalible === null) {
      checkVodPreviewAvailability();
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
    // setIsHovered(true);
  }, [checkVodPreviewAvailability, previewAvalible]);

  const handleMouseOut = useCallback(event => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  }, []);

  // useEffect(() => {
  //   checkVodPreviewAvailability();
  // }, [checkVodPreviewAvailability]);

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
    <div className={styles.videoVod}>
      <div className={styles.imgContainer} ref={ref}>
        <a className={styles.img} href={data.data.url}>
          {/* {isHovered && data.data.thumbnail_url ? ( */}
          {isHovered && data.data.thumbnail_url && previewAvalible ? (
            <div
              alt=''
              className={styles.vodPreview}
              style={{
                width: "320px",
                height: "180px",
                backgroundImage: `url(${vodPreview})`,
                borderRadius: "10px",
              }}></div>
          ) : (
            <img
              src={
                data.data.thumbnail_url
                  ? data.data.thumbnail_url.replace("%{width}", 1280).replace("%{height}", 720)
                  : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
              }
              alt={styles.thumbnail}
            />
          )}
        </a>
        <p className={styles.duration}>{Utilities.formatTwitchVodsDuration(data.data.duration)}</p>
      </div>
      <h4 className={styles.title}>
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
          <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
            {Utilities.truncate(data.data.title, 50)}
          </a>
        </OverlayTrigger>
      </h4>

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
              width: "unset",
              dispaly: "block",
              gridColumn: 2,
              justifySelf: "right",
            }}
            fromNow>
            {data.data.published_at}
          </Moment>
        </div>
      </div>
    </div>
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
