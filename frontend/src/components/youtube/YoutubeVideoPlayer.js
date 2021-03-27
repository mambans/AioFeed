import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';

const StyledYoutubeIframe = styled(YouTube)`
  border: none;
  height: 100%;
  width: 100%;
  grid-area: 'video';
`;

export default ({ playNext }) => {
  const [video, setVideo] = useState({});
  const videoId = useParams().videoId;
  const location = useLocation();
  const getVideoInfoTimer = useRef();

  useEffect(() => {
    setVideo({ id: videoId, startTime: location.search?.replace(/[?t=]|s/g, '') });
  }, [location.search, videoId]);

  const setDocumentTitle = (event) => {
    if (event?.target?.getVideoData()?.author && event?.target?.getVideoData()?.title) {
      document.title = `${event.target?.getVideoData()?.author} - ${
        event.target?.getVideoData()?.title
      }`;
      return true;
    }
    getVideoInfoTimer.current = setTimeout(() => setDocumentTitle(event), 200);
  };

  const onError = (e) => console.warn(e);
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: 'https://aiofeed.com',
      start: video.startTime,
      frameborder: '0',
      fs: 1,
    },
  };

  return (
    <>
      <StyledYoutubeIframe
        videoId={video.id}
        opts={opts}
        id={video.id + 'player'}
        containerClassName='IframeContainer'
        onReady={(event) => setDocumentTitle(event)}
        onEnd={playNext}
        onError={onError}
        // onPlay={(event) => {
        //   // clearTimeout(getVideoInfoTimer.current);
        //   // document.title = `${event.target.getVideoData().title}`;
        // }}
      />
    </>
  );
};
