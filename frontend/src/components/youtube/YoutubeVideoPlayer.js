import { useParams, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import FavoritesContext from '../favorites/FavoritesContext';
import useQuery from '../../hooks/useQuery';
import autoPlayNext from './../favorites/autpPlayNext';

const StyledYoutubeIframe = styled(YouTube)`
  border: none;
  height: 100%;
  width: 100%;
  grid-area: 'video';
`;

export default ({ listVideos, autoPlayNextEnabled }) => {
  const [video, setVideo] = useState({});
  const videoId = useParams().videoId;
  const location = useLocation();
  const getVideoInfoTimer = useRef();
  const navigate = useNavigate();
  const listName = useQuery().get('list') || useQuery().get('listName') || null;
  const { lists } = useContext(FavoritesContext) || {};
  const list =
    lists && lists[Object.keys(lists).find((key) => key.toLowerCase() === listName?.toLowerCase())];

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

  const playNext = () => {
    const nextVideoUrl = autoPlayNext({ listVideos, videoId, list, listName, autoPlayNextEnabled });
    if (nextVideoUrl) navigate(nextVideoUrl);
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
