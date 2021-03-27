import { Link } from 'react-router-dom';
import moment from 'moment';
import React, { useRef, useState, useContext } from 'react';

import {
  VideoContainer,
  VideoTitleHref,
  ImageContainer,
  ImgBottomInfo,
} from './../sharedStyledComponents';
import VideoHoverIframe from './VideoHoverIframe';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import FavoriteButton from '../favorites/buttonList/FavoriteButton';
import { ChannelNameLink, PublishedDate } from './StyledComponents';
import { YoutubeContext } from './useToken';
import ToolTip from '../ToolTip';

export const videoImageUrls = ({ maxres, standard, high, medium } = {}) =>
  maxres?.url ||
  standard?.url ||
  high?.url ||
  medium?.url ||
  `${process.env.PUBLIC_URL}/images/placeholder.jpg`;

const HOVER_DELAY = 1000;

export default ({ list, video, setDragSelected, listName, active, ...props }) => {
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
      <ImageContainer id={video.contentDetails?.upload?.videoId} ref={ref} active={active}>
        <FavoriteButton
          list={list}
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
          <ImgBottomInfo>
            <span>{moment.duration(video.contentDetails.duration).format('hh:mm:ss')}</span>
          </ImgBottomInfo>
        )}
      </ImageContainer>
      <ToolTip
        show={video.snippet.title?.length >= 50}
        tooltip={video.snippet.title}
        placement={'bottom'}
      >
        <VideoTitleHref
          href={`https://www.youtube.com/watch?v=` + video.contentDetails?.upload?.videoId}
        >
          {video.snippet.title}
        </VideoTitleHref>
      </ToolTip>
      <ChannelNameLink href={`https://www.youtube.com/channel/` + video.snippet.channelId}>
        {video.snippet.channelTitle}
      </ChannelNameLink>
      <PublishedDate fromNow>{video.snippet.publishedAt}</PublishedDate>
    </VideoContainer>
  );
};
