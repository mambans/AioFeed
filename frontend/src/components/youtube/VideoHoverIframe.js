import React, { useContext, useRef } from 'react';

import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import FeedsContext from '../feed/FeedsContext';
import { YoutubeIframe } from './StyledComponents';

const VideoHoverIframe = (data) => {
  const { feedVideoSizeProps } = useContext(FeedsContext);
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
    }, 200);
  }

  const opts = {
    height: (feedVideoSizeProps.width / 16) * 9,
    width: feedVideoSizeProps.width,
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
export default VideoHoverIframe;
