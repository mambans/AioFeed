import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect, useCallback, useRef } from "react";
import ReactTooltip from "react-tooltip";
import { store } from "react-notifications-component";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

function RenderTwitch(data) {
  const streamData = useRef();

  function streamType(type) {
    if (type === "live") {
      return <div className={styles.liveDot} />;
    } else {
      return <p className={styles.type}>{data.data.stream_type}</p>;
    }
  }

  const addNotification = useCallback(
    (type, status) => {
      return store.addNotification({
        content: (
          <div className={`notification-custom-${type}`}>
            <div className="notification-custom-icon">
              <img src={data.data.profile_img_url} alt="" className="notificationProfileIcon"></img>
            </div>
            <div className="notification-custom-content">
              <p className="notification-title">{data.data.user_name + " " + status}</p>
              <p className="notification-message">{Utilities.truncate(data.data.title, 50)}</p>
              <p className="notification-game">{data.data.game_name}</p>
            </div>
          </div>
        ),
        width: 450,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "slideInRight"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 7500,
        },
      });
    },
    [data.data.game_name, data.data.profile_img_url, data.data.title, data.data.user_name]
  );

  useEffect(() => {
    if (streamData.current === undefined || streamData.current.id !== data.data.id) {
      addNotification("twitch-online", "Live");
      streamData.current = data.data;
    } else if (
      streamData.current.game_id !== data.data.game_id ||
      streamData.current.title !== data.data.title
    ) {
      addNotification("twitch-update", "UPDATE");
      streamData.current = data.data;
    }
  }, [addNotification, data.data, data.data.id]);

  useEffect(() => {
    return () => {
      store.addNotification({
        content: (
          <div className={`notification-custom-twitch-offline`}>
            <div className="notification-custom-icon">
              <img src={data.data.profile_img_url} alt="" className="notificationProfileIcon"></img>
            </div>
            <div className="notification-custom-content">
              <p className="notification-title">{data.data.user_name + " Offline"}</p>
            </div>
          </div>
        ),
        width: 350,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "slideInRight"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 7500,
        },
      });
    };
  }, [data.data.id, data.data.profile_img_url, data.data.user_name]);

  return (
    <>
      <ReactTooltip delayShow={250} place="bottom" type="dark" effect="solid" />
      <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
        <div className={`${styles.video}`} key={data.data.id}>
          <div className={styles.imgContainer}>
            <a
              className={styles.img}
              // href={"https://www.twitch.tv/" + this.props.data.data.user_name.toLowerCase()}>
              href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.data.user_name.toLowerCase()
              }>
              <img
                src={
                  data.data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
                  `#` +
                  new Date().getTime()
                }
                alt={styles.thumbnail}
              />
            </a>
            <Moment className={styles.duration} durationFromNow>
              {data.data.started_at}
            </Moment>
            {streamType(data.data.type)}
          </div>
          <h4 className={styles.title}>
            <a
              data-tip={data.data.title}
              href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
              {Utilities.truncate(data.data.title, 50)}
            </a>
          </h4>
          <div>
            <div className={styles.channelContainer}>
              <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
                <img src={data.data.profile_img_url} alt="" className={styles.profile_img}></img>
              </a>
              <p className={styles.channel}>
                <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
                  {data.data.user_name}
                </a>
              </p>
            </div>
            <div className={styles.gameContainer}>
              <a
                className={styles.game_img}
                href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
                <img
                  src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
                  alt=""
                  className={styles.game_img}></img>
              </a>
              <p className={styles.game}>
                <a href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
                  {data.data.game_name}
                </a>
              </p>
              <p className={styles.viewers}>{data.data.viewer_count}</p>
            </div>
          </div>
        </div>
      </Animated>
    </>
  );
}

export default RenderTwitch;
