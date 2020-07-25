import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useRef, useState, useContext } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';

import { truncate } from '../../util/Utils';
import { VideoContainer, VideoTitleHref, ImageContainer } from './../sharedStyledComponents';
import FeedsContext from '../feed/FeedsContext';
import styles from './Youtube.module.scss';
import VideoHoverIframe from './VideoHoverIframe';
import useEventListener from '../../hooks/useEventListener';

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

export default (data) => {
  const { youtubeVideoHoverEnable } = useContext(FeedsContext);
  const streamHoverTimer = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  useEventListener('mouseenter', handleMouseOver, ref.current, youtubeVideoHoverEnable);
  useEventListener('mouseleave', handleMouseOut, ref.current, youtubeVideoHoverEnable);

  // function streamType(type) {
  //   if (type === "liveYoutube") {
  //     return <div className={styles.liveDot} />;
  //   } else {
  //     return null;
  //   }
  // }

  function handleMouseOver() {
    streamHoverTimer.current = setTimeout(function () {
      setIsHovered(true);
    }, HOVER_DELAY);
  }

  function handleMouseOut() {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
    document.getElementById(data.video.contentDetails.upload.videoId).src = 'about:blank';
  }

  return (
    <VideoContainer key={data.video.contentDetails.upload.videoId}>
      <ImageContainer id={data.video.contentDetails.upload.videoId} ref={ref}>
        {isHovered && (
          <VideoHoverIframe
            id={data.video.contentDetails.upload.videoId}
            data={data.video}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        )}
        <Link
          className={styles.img}
          // href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}
          to={`/youtube/` + data.video.contentDetails.upload.videoId}
        >
          <img src={videoImageUrls(data.video.snippet.thumbnails)} alt={styles.thumbnail} />
        </Link>
        {data.video.duration && <p className={styles.duration}>{data.video.duration}</p>}
        {/* {data.video.df === "liveYoutube" ? (
          <Moment className={styles.duration} durationFromNow>
            {data.video.duration}
          </Moment>
        ) : (
          <p className={styles.duration}>{data.video.duration}</p>
        )}
        {streamType(data.video.df)} */}
      </ImageContainer>
      {data.video.snippet.title.length >= 50 ? (
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
              {data.video.snippet.title}
            </Tooltip>
          }
        >
          <VideoTitleHref
            href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}
          >
            {truncate(data.video.snippet.title, 50)}
          </VideoTitleHref>
        </OverlayTrigger>
      ) : (
        <VideoTitleHref
          href={`https://www.youtube.com/watch?v=` + data.video.contentDetails.upload.videoId}
        >
          {data.video.snippet.title}
        </VideoTitleHref>
      )}
      <p className={styles.channel}>
        <a href={`https://www.youtube.com/channel/` + data.video.snippet.channelId}>
          {data.video.snippet.channelTitle}
        </a>
      </p>
      <Moment className={styles.date} fromNow>
        {data.video.snippet.publishedAt}
      </Moment>
    </VideoContainer>
  );
};
