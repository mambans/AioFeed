import Moment from "react-moment";
import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

import VideoHoverIframe from "./VideoHoverIframe";
import styles from "./Youtube.module.scss";
import { truncate } from "../../util/Utils";

import { VideoContainer, VideoTitleHref, ImageContainer } from "./../sharedStyledComponents";
import FeedsContext from "../feed/FeedsContext";

const videoImageUrls = (urls) => {
  if (urls.maxres) {
    return urls.maxres.url;
  } else if (urls.standard) {
    return urls.standard.url;
  } else if (urls.high) {
    return urls.high.url;
  } else if (urls.medium) {
    return urls.medium.url;
  } else {
    return `${process.env.PUBLIC_URL}/images/placeholder.webp`;
  }
};

const HOVER_DELAY = 1000;

export default (data) => {
  const { youtubeVideoHoverEnable } = useContext(FeedsContext);
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
    streamHoverTimer.current = setTimeout(function () {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(() => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
    document.getElementById(data.video.contentDetails.upload.videoId).src = "about:blank";
  }, [data.video.contentDetails.upload.videoId]);

  useEffect(() => {
    if (ref.current && youtubeVideoHoverEnable) {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [handleMouseOut, youtubeVideoHoverEnable]);

  return (
    <VideoContainer key={data.video.contentDetails.upload.videoId}>
      <ImageContainer id={data.video.contentDetails.upload.videoId} ref={ref}>
        {isHovered && (
          <VideoHoverIframe
            id={data.video.contentDetails.upload.videoId}
            data={data.video}
            isHovered={isHovered}
            setIsHovered={setIsHovered}></VideoHoverIframe>
        )}
        <Link
          className={styles.img}
          // href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}
          to={`/youtube/` + data.video.contentDetails.upload.videoId}>
          <img src={videoImageUrls(data.video.snippet.thumbnails)} alt={styles.thumbnail} />
        </Link>
        {data.video.duration && <p className={styles.duration}>{data.video.duration}</p>}
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
        <VideoTitleHref
          href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}>
          {truncate(data.video.snippet.title, 60)}
        </VideoTitleHref>
      </OverlayTrigger>
      <p className={styles.channel}>
        <a href={`https://www.youtube.com/channel/` + data.video.snippet.channelId}>
          {data.video.snippet.channelTitle}
        </a>
      </p>
      <Moment className={styles.date} fromNow>
        {data.video.snippet.publishedAt}
      </Moment>
    </VideoContainer>
  );
};
