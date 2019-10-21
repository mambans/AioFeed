import React, { useEffect, useCallback, useRef } from "react";
import YouTube from "react-youtube";

import styles from "./Youtube.module.scss";

function VideoHoverIframe(data) {
  const ref = useRef();
  const videoHoverOutTimer = useRef();

  const handleMouseOver = useCallback(() => {
    clearTimeout(videoHoverOutTimer.current);
    data.setIsHovered(true);
  }, [data]);

  const handleMouseOut = useCallback(
    event => {
      data.setIsHovered(false);
      videoHoverOutTimer.current = setTimeout(() => {
        event.target.src = "about:blank";
        document.getElementById(`${data.data.contentDetails.upload.videoId}-iframe`).src =
          "about:blank";
      }, 200);
    },
    [data]
  );

  useEffect(() => {
    data.setIsHovered(true);
    if (ref.current) {
      const refEle = ref.current;
      ref.current.addEventListener("mousenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mousenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
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