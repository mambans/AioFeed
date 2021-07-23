import { Link } from 'react-router-dom';
import moment from 'moment';
import React, { useRef } from 'react';

import {
  VideoContainer,
  VideoTitleHref,
  ImageContainer,
  ImgBottomInfo,
} from '../sharedComponents/sharedStyledComponents';
import VideoHoverIframe from './VideoHoverIframe';
import FavoriteButton from '../favorites/addToListModal/FavoriteButton';
import { ChannelNameLink, PublishedDate } from './StyledComponents';
import ToolTip from '../sharedComponents/ToolTip';

export const videoImageUrls = ({ maxres, standard, high, medium } = {}) =>
  maxres?.url ||
  standard?.url ||
  high?.url ||
  medium?.url ||
  `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`;

const YoutubeVideoElement = ({ list, video, setDragSelected, listName, active, ...props }) => {
  const ref = useRef();

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
        <FavoriteButton list={list} videoId_p={video.contentDetails?.upload?.videoId} />
        <VideoHoverIframe id={video.contentDetails?.upload?.videoId} data={video} imageRef={ref} />
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

export default YoutubeVideoElement;
