import React, { useEffect, useRef } from "react";

import YoutubeVideoElement from "./YoutubeVideoElement";

function RenderYoutube(data) {
  const videoData = useRef();

  useEffect(() => {
    videoData.current = data.video;
    data.runChange(false);
  }, [data]);

  return <YoutubeVideoElement video={data.video}></YoutubeVideoElement>;
}

export default RenderYoutube;
