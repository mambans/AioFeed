import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect } from "react";
import { store } from "react-notifications-component";
import ReactTooltip from "react-tooltip";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

function RenderTwitchVods(data) {
  useEffect(() => {
    function addNotification(title, message, type) {
      store.addNotification({
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
    addNotification(
      `Added vod: ${data.data.user_name}`,
      Utilities.truncate(data.data.title, 50),
      "info"
    );
    return () => {
      addNotification(
        `Removed vod: ${data.data.user_name}`,
        Utilities.truncate(data.data.title, 50),
        "danger"
      );
    };
  }, [data.data.title, data.data.user_name]);

  return (
    <>
      <ReactTooltip delayShow={250} place="bottom" type="dark" effect="solid" />
      <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
        <div className={styles.video}>
          <div className={styles.imgContainer}>
            <a className={styles.img} href={data.data.url}>
              <img
                src={
                  data.data.thumbnail_url
                    ? data.data.thumbnail_url.replace("%{width}", 640).replace("%{height}", 360)
                    : "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
                }
                alt={styles.thumbnail}
              />
            </a>
            <p className={styles.duration}>
              {data.data.duration
                .replace("h", ":")
                .replace("m", ":")
                .replace("s", "")}
            </p>
          </div>
          <h4 className={styles.title}>
            <a
              data-tip={data.data.title}
              href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
              {Utilities.truncate(data.data.title, 50)}
            </a>
          </h4>
          <div>
            <p className={styles.channel}>
              <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
                {data.data.user_name}
              </a>
            </p>
            <p className={styles.game}>{data.data.type}</p>
            {
              <Moment className={styles.viewers} fromNow>
                {data.data.published_at}
              </Moment>
            }
          </div>
        </div>
      </Animated>
    </>
  );
}

export default RenderTwitchVods;
