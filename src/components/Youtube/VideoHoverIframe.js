import React, { useEffect, useCallback } from "react";
import YouTube from "react-youtube";

import styles from "./Youtube.module.scss";

function VideoHoverIframe(data) {
  const handleMouseOver = useCallback(() => {
    data.setIsHovered(true);
  }, [data]);

  const handleMouseOut = useCallback(() => {
    data.setIsHovered(false);
  }, [data]);

  useEffect(() => {
    data.setIsHovered(true);
    const node = document.getElementById(`${data.data.contentDetails.upload.videoId}-iframe`);

    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseout", handleMouseOut);

    return () => {
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseout", handleMouseOut);
    };
  }, [data, handleMouseOut, handleMouseOver]);

  const opts = {
    height: 180,
    width: 320,
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: "http://localhost:3000/feed",
      start: 10,
      fs: 0,
    },
  };

  return (
    <YouTube
      videoId={data.data.contentDetails.upload.videoId}
      opts={opts}
      id={data.data.contentDetails.upload.videoId + "-iframe"}
      className={styles.VideoHoverIframe}
      // containerClassName={styles.VideoHoverIframe}
    />
  );
}

export default VideoHoverIframe;
