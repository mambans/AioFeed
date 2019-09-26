import { Animated } from "react-animated-css";
import Moment from "react-moment";
import React, { useEffect, useRef, useState } from "react";
import { store } from "react-notifications-component";
import ReactTooltip from "react-tooltip";

import Utilities from "utilities/Utilities";
import styles from "./Youtube.module.scss";

function YoutubeVideoElement(data) {
  function streamType(type) {
    if (type === "liveYoutube") {
      return <div className={styles.liveDot} />;
    } else {
      return null;
    }
  }
  return (
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
  );
}

function RenderYoutube(data) {
  const videoData = useRef();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    function addNotification(type) {
      store.addNotification({
        title: data.data.snippet.channelTitle,
        message: `${Utilities.truncate(data.data.snippet.title, 50)}`,
        content: (
          <div className={`notification-custom-${type}`}>
            <div className='notification-custom-icon'>
              <img
                src={data.data.snippet.thumbnails.medium.url}
                alt=''
                className={"youtube-notificationProfileIcon"}></img>
            </div>
            <div className='notification-custom-content'>
              <p className='notification-title'>{data.data.snippet.channelTitle}</p>
              <p className='notification-message'>
                {Utilities.truncate(data.data.snippet.title, 50)}
              </p>
              <p className='notification-duration'>{data.data.duration}</p>
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
    }

    if (
      (videoData.current === undefined ||
        videoData.current.contentDetails.upload.videoId !==
          data.data.contentDetails.upload.videoId) &&
      !data.run.initial
    ) {
      setAnimate(true);
      addNotification("youtube-new-video");
    }
    videoData.current = data.data;
    data.runChange(false);
  }, [data]);

  return (
    <>
      <ReactTooltip delayShow={250} place='bottom' type='dark' effect='solid' />
      {animate ? (
        <Animated animationIn='zoomIn' animationOut='fadeOut' isVisible={true}>
          <YoutubeVideoElement data={data.data}></YoutubeVideoElement>
        </Animated>
      ) : (
        <YoutubeVideoElement data={data.data}></YoutubeVideoElement>
      )}
    </>
  );
}

export default RenderYoutube;
