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
import AddToListButton from '../myLists/addToListModal/AddToListButton';
import { ChannelNameLink, PublishedDate } from './StyledComponents';
import ToolTip from '../../components/tooltip/ToolTip';
import AddRemoveFromPlayQueueButton from '../sharedComponents/AddRemoveFromPlayQueueButton';
import RemoveFromCurrentListButton from '../myLists/addToListModal/RemoveFromCurrentListButton';

export const videoImageUrls = ({ maxres, standard, high, medium } = {}) =>
  maxres?.url ||
  standard?.url ||
  high?.url ||
  medium?.url ||
  `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`;

const YoutubeVideoElement = React.memo(
  ({ list, video, setDragSelected, listName, active, setPlayQueue, playQueue, ...props }) => {
    const ref = useRef();

    return (
      <VideoContainer
        key={video?.contentDetails?.upload?.videoId || video?.id}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', video.id);
          setDragSelected({ data: video, element: ref.current });
        }}
        {...props}
      >
        <ImageContainer id={video?.contentDetails?.upload?.videoId} ref={ref} active={active}>
          <RemoveFromCurrentListButton
            videoId_p={video?.contentDetails?.upload?.videoId}
            list={list}
          />
          <AddToListButton
            videoId_p={video?.contentDetails?.upload?.videoId}
            list={list}
            size={24}
          />
          {setPlayQueue && (
            <AddRemoveFromPlayQueueButton
              videoId={video?.contentDetails?.upload?.videoId}
              setPlayQueue={setPlayQueue}
              playQueue={playQueue}
              active={active}
            />
          )}
          <VideoHoverIframe
            id={video?.contentDetails?.upload?.videoId}
            data={video}
            imageRef={ref}
          />
          <Link
            className='imgLink'
            // href={`https://www.youtube.com/watch?v=` + video?.contentDetails?.upload?.videoId}
            to={
              `/youtube/` +
              video?.contentDetails?.upload?.videoId +
              (listName ? `?list=${listName}` : '')
            }
          >
            <img
              src={
                video?.error
                  ? `${process.env.PUBLIC_URL}/images/youtube-not-found.jpg`
                  : videoImageUrls(video?.snippet?.thumbnails)
              }
              alt=''
            />
          </Link>
          {video?.contentDetails.duration && (
            <ImgBottomInfo>
              <span>{moment.duration(video?.contentDetails?.duration).format('hh:mm:ss')}</span>
            </ImgBottomInfo>
          )}
        </ImageContainer>
        <ToolTip
          show={video?.snippet?.title?.length >= 50}
          tooltip={video?.snippet?.title}
          placement={'bottom'}
        >
          <VideoTitleHref
            error={!!video?.error}
            href={
              `https://www.youtube.com/watch?v=` +
              (video?.contentDetails?.upload?.videoId || video.id)
            }
          >
            {video?.snippet?.title}
          </VideoTitleHref>
        </ToolTip>
        <ChannelNameLink href={`https://www.youtube.com/channel/` + video?.snippet?.channelId}>
          {video?.snippet?.channelTitle}
        </ChannelNameLink>
        <PublishedDate fromNow>{video?.snippet?.publishedAt}</PublishedDate>
      </VideoContainer>
    );
  }
);

export default YoutubeVideoElement;
