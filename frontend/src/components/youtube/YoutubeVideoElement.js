import { Link } from 'react-router-dom';
import moment from 'moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useRef, useState, useContext } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';

import { truncate } from '../../util/Utils';
import {
  VideoContainer,
  VideoTitleHref,
  ImageContainer,
  Duration,
} from './../sharedStyledComponents';
import FeedsContext from '../feed/FeedsContext';
import VideoHoverIframe from './VideoHoverIframe';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import AddVideoButton from '../favorites/AddVideoButton';
import { ChannelNameLink, PublishedDate } from './StyledComponents';

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

export default ({ video }) => {
  const { youtubeVideoHoverEnable } = useContext(FeedsContext);
  const streamHoverTimer = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, ref.current, youtubeVideoHoverEnable);
  useEventListenerMemo('mouseleave', handleMouseOut, ref.current, youtubeVideoHoverEnable);

  function handleMouseOver() {
    streamHoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DELAY);
  }

  function handleMouseOut() {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
    document.getElementById(video.contentDetails?.upload?.videoId).src = 'about:blank';
  }

  return (
    <VideoContainer key={video.contentDetails?.upload?.videoId}>
      <ImageContainer id={video.contentDetails?.upload?.videoId} ref={ref}>
        <AddVideoButton
          videoId_p={video.contentDetails?.upload?.videoId}
          disablepreview={handleMouseOut}
        />
        {isHovered && (
          <VideoHoverIframe
            id={video.contentDetails?.upload?.videoId}
            data={video}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        )}

        <Link
          // href={`https://www.youtube.com/watch?v=` + video.contentDetails?.upload?.videoId}
          to={`/youtube/` + video.contentDetails?.upload?.videoId}
        >
          <img src={videoImageUrls(video.snippet.thumbnails)} alt='' />
        </Link>
        {video.contentDetails.duration && (
          <Duration bottom='28px'>
            {moment.duration(video.contentDetails.duration).format('hh:mm:ss')}
          </Duration>
        )}
      </ImageContainer>
      {video.snippet.title?.length >= 50 ? (
        <OverlayTrigger
          key={'bottom'}
          placement={'bottom'}
          delay={{ show: 250, hide: 0 }}
          overlay={
            <Tooltip
              id={`tooltip-${'bottom'}`}
              style={{
                width: '336px',
              }}
            >
              {video.snippet.title}
            </Tooltip>
          }
        >
          <VideoTitleHref
            href={`https://www.youtube.com/watch?v=` + video.contentDetails?.upload?.videoId}
          >
            {truncate(video.snippet.title, 50)}
          </VideoTitleHref>
        </OverlayTrigger>
      ) : (
        <VideoTitleHref
          href={`https://www.youtube.com/watch?v=` + video.contentDetails?.upload?.videoId}
        >
          {video.snippet.title}
        </VideoTitleHref>
      )}
      <ChannelNameLink href={`https://www.youtube.com/channel/` + video.snippet.channelId}>
        {video.snippet.channelTitle}
      </ChannelNameLink>
      <PublishedDate fromNow>{video.snippet.publishedAt}</PublishedDate>
    </VideoContainer>
  );
};
