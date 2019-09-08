import Moment from "react-moment";
import React, { useEffect } from "react";
import { store } from "react-notifications-component";
import ReactTooltip from "react-tooltip";

import Utilities from "utilities/Utilities";
import styles from "./Youtube.module.scss";

function RenderYoutube(data) {
  function streamType(type) {
    if (type === "liveYoutube") {
      return <div className={styles.liveDot} />;
    } else {
      return null;
    }
  }

  useEffect(() => {
    function addNotification() {
      store.addNotification({
        title: data.data.snippet.channelTitle,
        message: `${Utilities.truncate(data.data.snippet.title, 50)}`,
        type: "default",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 15000,
          onScreen: true,
          pauseOnHover: true,
        },
      });
    }

    addNotification();
  }, [data.data.snippet.channelTitle, data.data.snippet.title]);

  return (
    <>
      <ReactTooltip delayShow="250" place="bottom" type="dark" effect="solid" />

      <div className={styles.video} key={data.data.contentDetails.upload.videoId}>
        <div className={styles.imgContainer}>
          <a
            className={styles.img}
            href={`https://www.youtube.com/watch?v=` + data.data.contentDetails.upload.videoId}>
            <img
              src={Utilities.videoImageUrls(data.data.snippet.thumbnails)}
              // src={placeholderImg}
              alt={styles.thumbnail}
            />
          </a>
          {data.data.df === "liveYoutube" ? (
            <Moment className={styles.duration} durationFromNow>
              {data.data.duration}
            </Moment>
          ) : (
            <p className={styles.duration}>{data.data.duration}</p>
          )}
          {streamType(data.data.df)}
        </div>
        <h4 className={styles.title}>
          <a
            data-tip={data.data.snippet.title}
            href={`https://www.youtube.com/watch?v=` + data.data.contentDetails.upload.videoId}>
            {Utilities.truncate(data.data.snippet.title, 50)}
          </a>
        </h4>
        <Moment className={styles.date} fromNow>
          {data.data.snippet.publishedAt}
        </Moment>
        <p className={styles.channel}>
          <a href={`https://www.youtube.com/channel/` + data.data.snippet.channelId}>
            {data.data.snippet.channelTitle}
          </a>
        </p>
      </div>
    </>
  );
}

export default RenderYoutube;
