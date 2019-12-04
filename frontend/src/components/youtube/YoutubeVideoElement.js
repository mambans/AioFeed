import Moment from "react-moment";
import React, { useEffect, useRef, useState, useCallback } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import VideoHoverIframe from "./VideoHoverIframe";
import styles from "./Youtube.module.scss";
import Utilities from "../../utilities/Utilities";

import { VideoContainer, VideoTitle, ImageContainer } from "./../sharedStyledComponents";

const HOVER_DELAY = 1000;

function YoutubeVideoElement(data) {
  const streamHoverTimer = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  // function streamType(type) {
  //   if (type === "liveYoutube") {
  //     return <div className={styles.liveDot} />;
  //   } else {
  //     return null;
  //   }
  // }

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(() => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
    document.getElementById(data.video.contentDetails.upload.videoId).src = "about:blank";
  }, [data.video.contentDetails.upload.videoId]);

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
    <VideoContainer key={data.video.contentDetails.upload.videoId}>
      <ImageContainer id={data.video.contentDetails.upload.videoId} ref={ref}>
        {isHovered ? (
          <VideoHoverIframe
            id={data.video.contentDetails.upload.videoId}
            data={data.video}
            setIsHovered={setIsHovered}></VideoHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}>
          <img
            src={Utilities.videoImageUrls(data.video.snippet.thumbnails)}
            alt={styles.thumbnail}
          />
        </a>
        <p className={styles.duration}>{data.video.duration}</p>
        {/* {data.video.df === "liveYoutube" ? (
          <Moment className={styles.duration} durationFromNow>
            {data.video.duration}
          </Moment>
        ) : (
          <p className={styles.duration}>{data.video.duration}</p>
        )}
        {streamType(data.video.df)} */}
      </ImageContainer>
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 250, hide: 0 }}
        overlay={
          <Tooltip
            id={`tooltip-${"bottom"}`}
            style={{
              width: "336px",
            }}>
            {data.video.snippet.title}
          </Tooltip>
        }>
        <VideoTitle
          href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}>
          {Utilities.truncate(data.video.snippet.title, 50)}
        </VideoTitle>
      </OverlayTrigger>
      <Moment className={styles.date} fromNow>
        {data.video.snippet.publishedAt}
      </Moment>
      <p className={styles.channel}>
        <a href={`https://www.youtube.com/channel/` + data.video.snippet.channelId}>
          {data.video.snippet.channelTitle}
        </a>
      </p>
    </VideoContainer>
  );
}

export default YoutubeVideoElement;
