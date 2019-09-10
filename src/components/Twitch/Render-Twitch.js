import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect, useCallback, useRef } from "react";
import { store } from "react-notifications-component";
import ReactTooltip from "react-tooltip";

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

  function gameName(input) {
    if (input.length > 50) return input.substring(0, 50) + "..";
    else if (input.length < 50) {
      return input + "\xa0".repeat(64 - input.length) + "\n";
    } else return input;
  }

  const addOnlineNotification = useCallback(() => {
    // const styles = {
    //   "animation-name": "timer",
    //   "animation-duration": "7000ms",
    //   "animation-timing-function": "linear",
    //   "animation-fill-mode": "forwards",
    //   "animation-play-state": "running",
    // };

    // const textContent = React.createElement(
    //   "div",
    //   {
    //     className: "notification-content",
    //   },
    //   <p className="notification-title">{data.data.user_name + " Live"}</p>,
    //   <p className="notification-message">{data.data.game_name}</p>,
    //   <p>{Utilities.truncate(data.data.title, 50)}</p>,
    //   <div className="timer">
    //     <div className="timer-filler" style={styles}></div>
    //   </div>
    // );

    return store.addNotification({
      title: data.data.user_name + " Live",
      message: `${gameName(data.data.game_name)} \n ${Utilities.truncate(data.data.title, 50)}`,
      // content: textContent,
      width: 350,
      type: "info",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "slideInRight"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 7000,
        onScreen: true,
        pauseOnHover: true,
      },
    });
    // }
  }, [data.data.game_name, data.data.title, data.data.user_name]);

  const addUpdateNotification = useCallback(() => {
    return store.addNotification({
      title: data.data.user_name + " UPDATE",
      message: `${gameName(data.data.game_name)} \n ${Utilities.truncate(data.data.title, 50)}`,
      // content: textContent,
      width: 350,
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "slideInRight"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 7000,
        onScreen: true,
        pauseOnHover: true,
      },
    });
  }, [data.data.game_name, data.data.title, data.data.user_name]);

  useEffect(() => {
    // console.log("streamData.current1: ", streamData.current);
    if (streamData.current === undefined || streamData.current.id !== data.data.id) {
      // console.log(data.data.user_name + " is live!");

      addOnlineNotification();
      streamData.current = data.data;
    } else if (streamData.current.game_id !== data.data.game_id) {
      streamData.current = data.data;
      addUpdateNotification();
    } else if (streamData.current.title !== data.data.title) {
      streamData.current = data.data;
      addUpdateNotification();
    }
    // console.log("streamData.current2: ", streamData.current);
  }, [addOnlineNotification, addUpdateNotification, data.data, data.data.id]);

  useEffect(() => {
    function addOfflineNotification(title, message, type) {
      return store.addNotification({
        title: title,
        message: message,
        width: 350,
        type: type,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "slideInRight"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 7000,
          onScreen: true,
          pauseOnHover: true,
        },
      });
    }
    return () => {
      addOfflineNotification(data.data.user_name, "Offline", "danger");
    };
  }, [data.data.id, data.data.user_name]);

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
