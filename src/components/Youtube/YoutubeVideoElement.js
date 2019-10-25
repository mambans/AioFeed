import Moment from "react-moment";
import React, { useEffect, useRef, useState, useCallback } from "react";

import VideoHoverIframe from "./VideoHoverIframe";
import styles from "./Youtube.module.scss";
import Utilities from "../../utilities/Utilities";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const HOVER_DELAY = 1000;

function YoutubeVideoElement(data) {
  const streamHoverTimer = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  function streamType(type) {
    if (type === "liveYoutube") {
      return <div className={styles.liveDot} />;
    } else {
      return null;
    }
  }

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(() => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
    document.getElementById(data.data.contentDetails.upload.videoId).src = "about:blank";
  }, [data.data.contentDetails.upload.videoId]);

  useEffect(() => {
    if (ref.current && localStorage.getItem(`YoutubeVideoHoverEnabled`) === "true") {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [handleMouseOut]);

  return (
    <div className={styles.video} key={data.data.contentDetails.upload.videoId}>
      <div id={data.data.contentDetails.upload.videoId} className={styles.imgContainer} ref={ref}>
        {isHovered ? (
          <VideoHoverIframe
            id={data.data.contentDetails.upload.videoId}
            data={data.data}
            setIsHovered={setIsHovered}></VideoHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={`https://www.youtube.com/watch?v=` + data.data.contentDetails.upload.videoId}>
          <img
            src={Utilities.videoImageUrls(data.data.snippet.thumbnails)}
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
              {data.data.snippet.title}
            </Tooltip>
          }>
          <a
            // data-tip={data.data.snippet.title}
            href={`https://www.youtube.com/watch?v=` + data.data.contentDetails.upload.videoId}>
            {Utilities.truncate(data.data.snippet.title, 50)}
          </a>
        </OverlayTrigger>
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

export default YoutubeVideoElement;
