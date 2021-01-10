import { MdVerticalAlignBottom } from 'react-icons/md';
import { useParams, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';

import { VideoAndChatContainer, ShowNavbarBtn } from './../twitch/player/StyledComponents';
import NavigationContext from './../navigation/NavigationContext';
import AddVideoButton from '../favorites/addRemoveButton/AddVideoButton';

const StyledYoutubeIframe = styled(YouTube)`
  border: none;
  height: 100%;
  width: 100%;
`;

export default () => {
  const [video, setVideo] = useState({});
  const videoId = useParams().videoId;
  const location = useLocation();
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const getVideoInfoTimer = useRef();

  useEffect(() => {
    setVideo({ id: videoId, startTime: location.search?.replace(/[?t=]|s/g, '') });
  }, [location.search, videoId]);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    setShrinkNavbar('true');
    setVisible(false);
    setFooterVisible(false);

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
      setVisible(true);
      clearTimeout(getVideoInfoTimer.current);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible]);

  const setDocumentTitle = (event) => {
    if (event?.target?.getVideoData()?.author && event?.target?.getVideoData()?.title) {
      document.title = `${event.target?.getVideoData()?.author} - ${
        event.target?.getVideoData()?.title
      }`;
      return true;
    }
    getVideoInfoTimer.current = setTimeout(() => setDocumentTitle(event), 200);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: 'https://aiofeed.com/youtube',
      start: video.startTime,
      frameborder: '0',
      fs: 1,
    },
  };

  return (
    <>
      <VideoAndChatContainer
        visible={visible}
        style={{
          display: 'unset',
        }}
      >
        <AddVideoButton videoId_p={video.id} style={{ right: '100px', opacity: '1' }} size={32} />
        <ShowNavbarBtn variant='dark' onClick={() => setVisible(!visible)} style={{ right: '0' }}>
          <MdVerticalAlignBottom
            style={{
              transform: visible ? 'rotateX(180deg)' : 'unset',
              right: '10px',
            }}
            size={30}
            title='Show navbar'
          />
          Navbar
        </ShowNavbarBtn>
        <StyledYoutubeIframe
          videoId={video.id}
          opts={opts}
          id={video.id + 'player'}
          containerClassName='IframeContainer'
          onReady={(event) => setDocumentTitle(event)}
          // onPlay={(event) => {
          //   // clearTimeout(getVideoInfoTimer.current);
          //   // document.title = `${event.target.getVideoData().title}`;
          // }}
        />
      </VideoAndChatContainer>
    </>
  );
};
