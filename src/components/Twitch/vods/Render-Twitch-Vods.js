import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { store } from "react-notifications-component";
// import ReactTooltip from "react-tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "./../Twitch.module.scss";
import Utilities from "./../../../utilities/Utilities";
// import Utilities from "utilities/Utilities";

function TwitchVodElement(data) {
  return (
    <div className={styles.videoVod}>
      <div className={styles.imgContainer}>
        <a className={styles.img} href={data.data.url}>
          <img
            src={
              data.data.thumbnail_url
                ? data.data.thumbnail_url.replace("%{width}", 1280).replace("%{height}", 720)
                : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
            }
            alt={styles.thumbnail}
          />
        </a>
        <p className={styles.duration}>{Utilities.formatTwitchVodsDuration(data.data.duration)}</p>
      </div>
      <h4 className={styles.title}>
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip
              id={`tooltip-${"bottom"}`}
              style={{
                width: "320px",
              }}>
              {data.data.title}
            </Tooltip>
          }>
          <a
            // data-tip={data.data.title}
            href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
            {Utilities.truncate(data.data.title, 50)}
          </a>
        </OverlayTrigger>
      </h4>

      <div>
        <div className={styles.channelContainer} style={{ marginBottom: "0px", height: "25px" }}>
          <p className={styles.channel} style={{ paddingLeft: "5px" }}>
            <a
              href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}
              style={{ color: "#f0f0f0" }}>
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
  const [animate, setAnimate] = useState(false);

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
    if (
      (vodData.current === undefined || vodData.current.id !== data.data.id) &&
      !data.run.initial
    ) {
      setAnimate(true);
      addNotification(`Added vod: ${data.data.user_name}`, "twitch-vod-add");
    }
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

  return (
    <>
      {/* <ReactTooltip delayShow={250} place='bottom' type='dark' effect='solid' /> */}
      {animate ? (
        <Animated animationIn='zoomIn' animationOut='fadeOut' isVisible={true}>
          <TwitchVodElement data={data.data}></TwitchVodElement>
        </Animated>
      ) : (
        <TwitchVodElement data={data.data}></TwitchVodElement>
      )}
    </>
  );
}

export default RenderTwitchVods;
