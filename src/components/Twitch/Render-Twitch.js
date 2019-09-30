import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect, useCallback, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";
import logo from "./../../assets/images/logo-v2.png";

function StreamEle(data) {
  function streamType(type) {
    if (type === "live") {
      return <div className={styles.liveDot} />;
    } else {
      return <p className={styles.type}>{data.data.stream_type}</p>;
    }
  }

  return (
    <div className={`${styles.video}`} key={data.data.id}>
      {data.newlyAdded ? (
        <Animated
          animationIn='fadeIn'
          animationOut='zoomOut'
          isVisible={false}
          animationOutDelay={1500}
          animationOutDuration={15000}
          style={{ gridArea: "highlight" }}>
          <div
            style={{
              height: 5,
              backgroundColor: "rgb(14, 203, 247)",
              borderRadius: 5,
              gridArea: "highlight",
              width: "100%",
            }}
          />
        </Animated>
      ) : (
        <div
          style={{
            height: 5,
            backgroundColor: "transparent",
            borderRadius: 5,
            gridArea: "highlight",
            width: "100%",
          }}
        />
      )}

      <div className={styles.imgContainer}>
        <a
          className={styles.img}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {/* href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.data.user_name.toLowerCase()
              }> */}
          <img
            src={
              data.data.thumbnail_url.replace("{width}", 1280).replace("{height}", 720) +
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
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </a>
          <p className={styles.channel}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
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
              alt=''
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
  );
}

function RenderTwitch(data) {
  const streamData = useRef();

  const addSystemNotification = useCallback(
    status => {
      if (Notification.permission === "granted") {
        let notification = new Notification(
          `${data.data.user_name} ${status === "offline" ? "Offline" : "Live"}`,
          {
            body:
              status === "offline"
                ? ""
                : `${Utilities.truncate(data.data.title, 60)}\n${data.data.game_name}`,
            icon: data.data.profile_img_url || logo,
            badge: data.data.profile_img_url || logo,
          }
        );

        notification.onclick = function(event) {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          status === "offline"
            ? window.open(
                "https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos",
                "_blank"
              )
            : window.open("https://www.twitch.tv/" + data.data.user_name.toLowerCase(), "_blank");
        };

        return notification;
      }
    },
    [data.data.game_name, data.data.profile_img_url, data.data.title, data.data.user_name]
  );

  useEffect(() => {
    if (
      (streamData.current === undefined || streamData.current.id !== data.data.id) &&
      !data.run.initial
    ) {
      // addSystemNotification("online");

      streamData.current = data.data;
    } else if (
      streamData.current === undefined ||
      streamData.current.game_id !== data.data.game_id ||
      streamData.current.title !== data.data.title
    ) {
      streamData.current = data.data;
    }
    streamData.current = data.data;
  }, [addSystemNotification, data, data.data, data.data.id]);

  return (
    <>
      <ReactTooltip delayShow={250} place='bottom' type='dark' effect='solid' />
      {data.newlyAdded ? (
        <Animated animationIn='zoomIn' animationOut='fadeOut' isVisible={true}>
          <StreamEle key={data.data.id} data={data.data} newlyAdded={data.newlyAdded}></StreamEle>
        </Animated>
      ) : (
        <StreamEle key={data.data.id} data={data.data} newlyAdded={data.newlyAdded}></StreamEle>
      )}
    </>
  );
}

export default RenderTwitch;
