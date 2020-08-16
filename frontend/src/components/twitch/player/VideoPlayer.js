import { CSSTransition } from 'react-transition-group';
import { useParams, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { MdVerticalAlignBottom } from 'react-icons/md';

import NavigationContext from './../../navigation/NavigationContext';
import { VideoAndChatContainer, ShowNavbarBtn } from './StyledComponents';
import PlayerNavbar from './PlayerNavbar';
import API from '../API';

export default () => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const time = useLocation().search.replace('?t=', '').replace('?time=', '');

  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  const [twitchVideoPlayer, setTwitchVideoPlayer] = useState();
  const [videoInfo, setVideoInfo] = useState();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    setShrinkNavbar('true');
    setVisible(false);
    setFooterVisible(false);

    setTwitchVideoPlayer(
      new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        video: videoId || null,
        muted: false,
        time: time.length >= 1 ? time : null,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      })
    );

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
      setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEffect(() => {
    document.title = `AF | ${(channelName && `${channelName} -`) || ''} ${videoId}`;

    const timer = setTimeout(async () => {
      if (twitchVideoPlayer) {
        const videoDetails = await API.getVideos({ params: { id: videoId } }).then(
          (r) => r.data.data[0]
        );
        document.title = `AF | ${videoDetails?.user_name || channelName || ''} - ${
          videoDetails?.title || videoId
        }`;
        if (videoDetails?.user_name && !channelName) {
          window.history.pushState(
            {},
            `AF | ${videoDetails?.user_name || ''} - ${videoDetails?.title || videoId}`,
            `/${videoDetails?.user_name}/videos/${videoId}`
          );
        }
        setVideoInfo(videoDetails);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [videoId, channelName, twitchVideoPlayer]);

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar
          channelName={channelName}
          streamInfo={videoInfo}
          twitchVideoPlayer={twitchVideoPlayer}
          setVisible={setVisible}
          visible={visible}
        />
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        visible={visible}
        style={{
          display: 'unset',
        }}
      >
        <ShowNavbarBtn
          variant='dark'
          type='video'
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <MdVerticalAlignBottom
            style={{
              transform: visible ? 'rotateX(180deg)' : 'unset',
              right: '10px',
            }}
            size={30}
            title='Show navbar'
          />
        </ShowNavbarBtn>
      </VideoAndChatContainer>
    </>
  );
};
