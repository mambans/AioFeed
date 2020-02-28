import React, { useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import styles from "./Twitch.module.scss";

function StreamHoverIframe(data) {
  const ref = useRef();
  const streamHoverOutTimer = useRef();

  const handleMouseOver = useCallback(() => {
    clearTimeout(streamHoverOutTimer.current);
    data.setIsHovered(true);
  }, [data]);

  const handleMouseOut = useCallback(
    event => {
      data.setIsHovered(false);
      streamHoverOutTimer.current = setTimeout(() => {
        event.target.src = "about:blank";
        document.getElementById(`${data.data.id}-iframe`).src = "about:blank";
      }, 200);
    },
    [data]
  );

  useEffect(() => {
    data.setIsHovered(true);

    if (ref.current) {
      const refEle = ref.current;
      refEle.addEventListener("mouseover", handleMouseOver);
      refEle.addEventListener("mouseout", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseover", handleMouseOver);
        refEle.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [data, handleMouseOut, handleMouseOver]);

  return (
    <>
      <iframe
        // url={`https://player.twitch.tv/?channel=${data.data.user_name}&muted=true`}
        // url={`https://player.twitch.tv/?twitch5=1&channel=${data.data.user_name}&autoplay=true&muted=false&!controls`}
        src={`https://player.twitch.tv/?twitch5=1&channel=${data.data.user_name}&autoplay=true&muted=false&!controls`}
        title={data.data.user_name + "-iframe"}
        className={styles.StreamHoverIframe}
        theme='dark'
        id={data.data.id + "-iframe"}
        width='336px'
        height='189px'
        display='inline'
        position='absolute'
        loading={"Loading.."}
        allowFullScreen={true}
        frameBorder='0'
      />
      <Link
        to={`/live/${data.data.user_name}`}
        alt=''
        style={{
          position: "absolute",
          height: "189px",
          width: "336px",
          zIndex: "10",
          padding: "0",
        }}>
        ""
      </Link>
    </>
  );
}

export default StreamHoverIframe;
