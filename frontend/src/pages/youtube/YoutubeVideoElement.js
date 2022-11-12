import { Link, useLocation } from 'react-router-dom';
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
  ({ list, video, listName, active, setPlayQueue, playQueue, ...props }) => {
    const ref = useRef();
    const location = useLocation();

    return (
      <VideoContainer key={video?.contentDetails?.upload?.videoId || video?.id} {...props}>
        <ImageContainer id={video?.contentDetails?.upload?.videoId} ref={ref} active={active}>
          <RemoveFromCurrentListButton
            videoId_p={video?.contentDetails?.upload?.videoId || video.id}
            list={list}
          />
          <AddToListButton
            videoId_p={video?.contentDetails?.upload?.videoId || video?.id}
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
            target={location?.pathname === '/feed' && '_blank'}
            className='imgLink'
            // href={`https://www.youtube.com/watch?v=` + video?.contentDetails?.upload?.videoId}
            to={
              `/youtube/` +
              (video?.contentDetails?.upload?.videoId || video.id) +
              (listName ? `?list=${listName}` : '')
            }
          >
            <img
              src={
                video?.error
                  ? `${process.env.PUBLIC_URL}/images/youtube-not-found.png`
                  : videoImageUrls(video?.snippet?.thumbnails) ||
                    `https://i3.ytimg.com/vi/${video.id}/maxresdefault.jpg`
              }
              alt=''
            />
          </Link>
          {video?.contentDetails?.duration && (
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
            {video?.snippet?.title || video.error}
          </VideoTitleHref>
        </ToolTip>
        <ChannelNameLink href={`https://www.youtube.com/channel/` + video?.snippet?.channelId}>
          {video?.snippet?.channelTitle}
        </ChannelNameLink>
        {video?.snippet?.publishedAt && (
          <PublishedDate fromNow>{video?.snippet?.publishedAt}</PublishedDate>
        )}{' '}
      </VideoContainer>
    );
  }
);

export default YoutubeVideoElement;
