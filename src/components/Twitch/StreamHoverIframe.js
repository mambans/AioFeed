import React, { useEffect, useCallback, useRef } from "react";
import Iframe from "react-iframe";

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
      ref.current.addEventListener("mouseover", handleMouseOver);
      ref.current.addEventListener("mouseout", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseover", handleMouseOver);
        refEle.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [data, handleMouseOut, handleMouseOver]);

  return (
    <Iframe
      // url={`https://player.twitch.tv/?channel=${data.data.user_name}&muted=true`}
      url={`https://player.twitch.tv/?twitch5=1&allowfullscreen&video=&channel=${data.data.user_name}&!playsinline&autoplay&!muted&!controls`}
      title={data.data.user_name + "-iframe"}
      className={styles.StreamHoverIframe}
      theme='dark'
      id={data.data.id + "-iframe"}
      width='100%'
      height='100%'
      display='inline'
      position='absolute'
      loading={"Loading.."}
    />
  );
}

export default StreamHoverIframe;
