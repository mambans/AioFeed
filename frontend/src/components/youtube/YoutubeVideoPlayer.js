import { MdVerticalAlignBottom } from 'react-icons/md';
import { useParams, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';

import { VideoAndChatContainer, ShowNavbarBtn } from './../twitch/player/StyledComponents';
import NavigationContext from './../navigation/NavigationContext';
// import PlayerNavbar from './PlayerNavbar';

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
      {/* <PlayerNavbar visible={visible} /> */}
      <VideoAndChatContainer
        visible={visible}
        style={{
          display: 'unset',
        }}
      >
        <ShowNavbarBtn
          variant='dark'
          onClick={() => {
            setVisible(!visible);
          }}
          style={{ right: '0' }}
        >
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
          onReady={(event) => {
            getVideoInfoTimer.current = setTimeout(() => {
              document.title = `AF | ${event.target.getVideoData().author} - ${
                event.target.getVideoData().title
              }`;
            }, 2500);
          }}
          // onPlay={(event) => {
          //   // clearTimeout(getVideoInfoTimer.current);
          //   // document.title = `AF | ${event.target.getVideoData().title}`;
          // }}
        />
      </VideoAndChatContainer>
    </>
  );
};
