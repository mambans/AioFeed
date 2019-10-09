import React, { useEffect, useCallback } from "react";
import Iframe from "react-iframe";

import styles from "./Twitch.module.scss";

function StreamHoverIframe(data) {
  const handleMouseOver = useCallback(() => {
    data.setIsHovered(true);
  }, [data]);

  const handleMouseOut = useCallback(() => {
    data.setIsHovered(false);
  }, [data]);

  useEffect(() => {
    data.setIsHovered(true);
    const node = document.getElementById(`${data.data.id}-iframe`);

    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseout", handleMouseOut);

    return () => {
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseout", handleMouseOut);
    };
  }, [data, handleMouseOut, handleMouseOver]);

  return (
    <Iframe
      // url={`https://player.twitch.tv/?channel=${data.data.user_name}&muted=true`}
      url={`https://player.twitch.tv/?twitch5=0&allowfullscreen&video=&channel=${data.data.user_name}&!playsinline&autoplay&!muted&!controls`}
      title={data.data.user_name + "-iframe"}
      className={styles.StreamHoverIframe}
      id={data.data.id + "-iframe"}
      theme='dark'
      width='100%'
      height='100%'
      display='inline'
      position='absolute'
      // frameBorder='0'
      // scrolling='no'
      loading='Loading..'
      // allowFullScreen={true}
    />
  );
}

export default StreamHoverIframe;
