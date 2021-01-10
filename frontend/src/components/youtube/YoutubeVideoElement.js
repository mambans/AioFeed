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
import VideoHoverIframe from './VideoHoverIframe';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import AddVideoButton from '../favorites/addRemoveButton/AddVideoButton';
import { ChannelNameLink, PublishedDate } from './StyledComponents';
import { YoutubeContext } from './useToken';

const videoImageUrls = ({ maxres, standard, high, medium } = {}) =>
  maxres?.url ||
  standard?.url ||
  high?.url ||
  medium?.url ||
  `${process.env.PUBLIC_URL}/images/placeholder.webp`;

const HOVER_DELAY = 1000;

export default ({ video, disableContextProvider, setDragSelected, listName, ...props }) => {
  const { youtubeVideoHoverEnable } = useContext(YoutubeContext);
  const [isHovered, setIsHovered] = useState(false);
  const streamHoverTimer = useRef();
  const ref = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, ref.current, youtubeVideoHoverEnable);
  useEventListenerMemo('mouseleave', handleMouseOut, ref.current, youtubeVideoHoverEnable);

  function handleMouseOver() {
    streamHoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DELAY);
  }

  function handleMouseOut() {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  }

  return (
    <VideoContainer
      key={video.contentDetails?.upload?.videoId}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', video.id);

        setDragSelected({ data: video, element: ref.current });
      }}
      {...props}
    >
      <ImageContainer id={video.contentDetails?.upload?.videoId} ref={ref}>
        <AddVideoButton
          videoId_p={video.contentDetails?.upload?.videoId}
          disablepreview={handleMouseOut}
          disableContextProvider={disableContextProvider}
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
          className='imgLink'
          // href={`https://www.youtube.com/watch?v=` + video.contentDetails?.upload?.videoId}
          to={
            `/youtube/` +
            video.contentDetails?.upload?.videoId +
            (listName ? `?list=${listName}` : '')
          }
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
          key={video.contentDetails?.upload?.videoId + 'YTTitleTooltip'}
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
