import { CSSTransition } from 'react-transition-group';
import { useParams, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { MdVerticalAlignBottom } from 'react-icons/md';

import NavigationContext from './../../navigation/NavigationContext';
import { VideoAndChatContainer, ShowNavbarBtn } from './StyledComponents';
import PlayerNavbar from './PlayerNavbar';
import API from '../API';
import AddVideoButton from '../../favorites/AddVideoButton';

export default () => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const time = useLocation().search?.replace(/[?t=]|/g, '') || null;

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
        time: time,
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
    document.title = `${(channelName && `${channelName} -`) || ''} ${videoId}`;

    const fetchDetailsForDocumentTitle = async () => {
      if (twitchVideoPlayer) {
        const videoDetails = await API.getVideos({ params: { id: videoId } }).then(
          (r) => r.data.data[0]
        );

        document.title = `${videoDetails?.user_name || channelName || ''} - ${
          videoDetails?.title || videoId
        }`;

        if (videoDetails?.user_name && !channelName) {
          window.history.pushState(
            {},
            `${videoDetails?.user_name || ''} - ${videoDetails?.title || videoId}`,
            `/${videoDetails?.user_name}/videos/${videoId}${time ? `?t=${time}` : ''}`
          );
        }

        setVideoInfo(videoDetails);
      }
    };

    const timer = setTimeout(fetchDetailsForDocumentTitle, 500);

    return () => clearTimeout(timer);
  }, [videoId, channelName, twitchVideoPlayer, time]);

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
        <AddVideoButton videoId_p={videoInfo?.id || videoId} style={{ right: '100px' }} size={32} />
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
