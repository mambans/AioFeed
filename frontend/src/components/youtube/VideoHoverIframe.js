import React, { useRef } from 'react';
import YouTube from 'react-youtube';

import styles from './Youtube.module.scss';
import useEventListener from '../../hooks/useEventListener';

export default (data) => {
  const ref = useRef();
  const videoHoverOutTimer = useRef();
  data.setIsHovered(true);

  useEventListener('mousenter', handleMouseOver, ref.current);
  useEventListener('mouseleave', handleMouseOut, ref.current);

  function handleMouseOver() {
    clearTimeout(videoHoverOutTimer.current);
    data.setIsHovered(true);
  }

  function handleMouseOut(event) {
    data.setIsHovered(false);
    videoHoverOutTimer.current = setTimeout(() => {
      event.target.src = 'about:blank';
      document.getElementById(`${data.data.contentDetails.upload.videoId}-iframe`).src =
        'about:blank';
    }, 200);
  }

  const opts = {
    height: 189,
    width: 336,
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: 'https://aiofeed.com/feed',
      start: 10,
      fs: 0,
    },
  };

  return (
    <YouTube
      videoId={data.data.contentDetails.upload.videoId}
      opts={opts}
      id={data.data.contentDetails.upload.videoId + '-iframe'}
      className={styles.VideoHoverIframe}
    />
  );
};
