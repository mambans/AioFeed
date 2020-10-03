import React, { useRef } from 'react';

import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { YoutubeIframe } from './StyledComponents';

export default (data) => {
  const ref = useRef();
  const videoHoverOutTimer = useRef();
  data.setIsHovered(true);

  useEventListenerMemo('mousenter', handleMouseOver, ref.current);
  useEventListenerMemo('mouseleave', handleMouseOut, ref.current);

  function handleMouseOver() {
    clearTimeout(videoHoverOutTimer.current);
    data.setIsHovered(true);
  }

  function handleMouseOut(event) {
    data.setIsHovered(false);
    videoHoverOutTimer.current = setTimeout(() => {
      event.target.src = 'about:blank';
      document.getElementById(`${data.data.contentDetails?.upload?.videoId}-iframe`).src =
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
    <YoutubeIframe
      videoId={data.data.contentDetails?.upload?.videoId}
      opts={opts}
      id={data.data.contentDetails?.upload?.videoId + '-iframe'}
    />
  );
};
