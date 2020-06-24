import { CSSTransition } from 'react-transition-group';
import { throttle } from 'lodash';
import { useParams, useLocation, Link } from 'react-router-dom';
import Moment from 'react-moment';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { MdVerticalAlignBottom } from 'react-icons/md';
import { FaTwitch } from 'react-icons/fa';
import { MdFullscreen } from 'react-icons/md';
import { MdCompareArrows } from 'react-icons/md';
import { MdFullscreenExit } from 'react-icons/md';
import { MdChat } from 'react-icons/md';
import { MdAccountBox } from 'react-icons/md';

import fetchStreamInfo from './fetchStreamInfo';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import NavigationContext from './../../navigation/NavigationContext';
import VolumeSlider from './VolumeSlider';
import {
  InfoDisplay,
  StyledChat,
  ToggleSwitchChatSide,
  VideoAndChatContainer,
  VolumeEventOverlay,
  ShowNavbarBtn,
  ResizeDevider,
  ChatOverlay,
  ResetVideoButton,
  SmallButtonContainer,
  ChannelButton,
  ChannelIconLink,
} from './StyledComponents';
import PlayerNavbar from './PlayerNavbar';
import setFavion from '../../setFavion';
import PlayPauseButton from './PlayPauseButton';
import ShowStatsButtons from './ShowStatsButtons';
import ShowSetQualityButtons from './ShowSetQualityButtons';
import OpenCloseChat from './OpenCloseChat';
import addSystemNotification from '../live/addSystemNotification';
import NotificationsContext from '../../notifications/NotificationsContext';
import ClipButton from './ClipButton';
import addGameName from './addGameName';
import addProfileImg from './addProfileImg';
import fetchChannelInfo from './fetchChannelInfo';
import { getLocalstorage, getCookie } from '../../../util/Utils';
import ContextMenu from './ContextMenu';
import AnimatedViewCount from '../live/AnimatedViewCount';
import ReAuthenticateButton from '../../navigation/sidebar/ReAuthenticateButton';
import AccountContext from '../../account/AccountContext';
import FeedsContext from '../../feed/FeedsContext';
import disconnectTwitch from '../disconnectTwitch';

const DEFAULT_CHAT_WIDTH = Math.max(window.innerWidth * 0.1, 175);

export default () => {
  const { p_title, p_game, p_channelInfos } = useLocation().state || {};
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const time = useLocation().search.replace('?t=', '').replace('?time=', '');

  const { addNotification } = useContext(NotificationsContext);
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { setTwitchToken, twitchToken } = useContext(AccountContext);
  const { setEnableTwitch } = useContext(FeedsContext);

  const [streamInfo, setStreamInfo] = useState(p_channelInfos);
  const [showControlls, setShowControlls] = useState();
  const [showUIControlls, setShowUIControlls] = useState();
  const [chatState, setChatState] = useState(
    getLocalstorage('TwitchChatState')
      ? {
          chatwidth: DEFAULT_CHAT_WIDTH,
          switchChatSide: false,
          hideChat: false,
          ...getLocalstorage('TwitchChatState'),
        }
      : {
          chatwidth: DEFAULT_CHAT_WIDTH,
          switchChatSide: false,
          hideChat: false,
        },
  );

  const hideChatSaved = useRef(
    getLocalstorage('TwitchChatState')
      ? getLocalstorage('TwitchChatState').hideChat || false
      : false,
  );
  const [isFullscreen, setIsFullscreen] = useState();
  const [resizeActive, setResizeActive] = useState(false);

  const PlayerUIControlls = useRef();
  const [twitchVideoPlayer, setTwitchVideoPlayer] = useState();
  const OpenedDate = useRef(Date.now());
  const fadeTimer = useRef();
  const refreshStreamInfoTimer = useRef();
  const videoElementRef = useRef();
  const hideChatDelay = useRef();
  const isLive = useRef();
  // const locatorageWidthTimer = useRef();

  useEffect(() => {
    if (channelName && !videoId && !streamInfo) {
      document.title = `AF | ${channelName} player`;
    } else if (videoId) {
      document.title = `AF | ${channelName || ''} - ${p_title || videoId}`;
    }
  }, [streamInfo, channelName, p_title, videoId]);

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
        channel: channelName && !videoId ? channelName : null,
        video: videoId || null,
        muted: false,
        time: time.length >= 1 ? time : null,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      }),
    );

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
      setVisible(true);
      clearInterval(refreshStreamInfoTimer.current);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEffect(() => {
    if (videoId && !channelName) {
      const timer = setTimeout(async () => {
        if (twitchVideoPlayer) {
          const streamInfo = await fetchStreamInfo(
            twitchVideoPlayer && twitchVideoPlayer.getChannelId()
              ? { user_id: twitchVideoPlayer.getChannelId() }
              : { user_login: channelName },
          );
          if (streamInfo.length) setStreamInfo(streamInfo);
        }
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [videoId, channelName, p_title, twitchVideoPlayer]);

  const addNoti = useCallback(
    ({ type, stream }) => {
      if (stream && type === 'Live') {
        addSystemNotification({
          status: 'Live',
          stream: stream,
          body: `${stream.title}\n${stream.game_name || ''}`,
        });

        addNotification([{ ...stream, notiStatus: type }]);
      }
    },
    [addNotification],
  );

  const removeFromStreamNotisFromPlayer = useCallback(() => {
    const streams = getLocalstorage('newLiveStreamsFromPlayer') || {
      data: [],
    };
    if (streams.data.length >= 1) {
      const newStreams = streams.data.filter(
        (item) => item.user_name.toLowerCase() !== channelName.toLowerCase(),
      );
      localStorage.setItem(
        'newLiveStreamsFromPlayer',
        JSON.stringify({ data: newStreams, updated: Date.now() }),
      );
    }
  }, [channelName]);

  const offlineEvents = useCallback(async () => {
    console.log('Stream is Offline');
    isLive.current = false;
    setShowUIControlls(false);
    clearInterval(refreshStreamInfoTimer.current);
    setStreamInfo(null);
    removeFromStreamNotisFromPlayer();
  }, [removeFromStreamNotisFromPlayer]);

  const GetAndSetStreamInfo = useCallback(async () => {
    if (twitchVideoPlayer) {
      const LIVEStreamInfo = await fetchStreamInfo(
        twitchVideoPlayer && twitchVideoPlayer.getChannelId()
          ? { user_id: twitchVideoPlayer.getChannelId() }
          : { user_login: channelName },
      );
      if (LIVEStreamInfo) {
        const streamWithGame = await addGameName({
          streamInfo,
          newStreamInfo: LIVEStreamInfo,
        });
        const streamWithGameAndProfile = await addProfileImg({
          user_id: LIVEStreamInfo.user_id,
          currentStreamObj: streamWithGame,
        });
        setStreamInfo(streamWithGameAndProfile);

        return streamWithGameAndProfile;
      } else {
        const streamWithGameAndProfile = await fetchChannelInfo(
          twitchVideoPlayer.getChannelId(),
          true,
        );
        setStreamInfo(streamWithGameAndProfile);
        return streamWithGameAndProfile;
      }
    }
  }, [twitchVideoPlayer, streamInfo, channelName]);

  const onlineEvents = useCallback(async () => {
    console.log('Stream is Online');
    isLive.current = true;
    document.title = `AF | ${channelName} -LIVE`;

    try {
      if (getCookie('Twitch-access_token')) {
        GetAndSetStreamInfo().then((res) => {
          setFavion(res.profile_img_url);
          if (
            streamInfo === null &&
            res &&
            res.broadcaster_software &&
            !res.broadcaster_software.toLowerCase().includes('rerun')
          ) {
            addNoti({ type: 'Live', stream: res });

            const streams = getLocalstorage('newLiveStreamsFromPlayer') || { data: [] };
            const newStreams = [...streams.data.filter((item) => item), res];
            const filteredStreams = newStreams.filter(
              (item, index, self) => index === self.findIndex((t) => t.user_id === item.user_id),
            );
            localStorage.setItem(
              'newLiveStreamsFromPlayer',
              JSON.stringify({
                data: filteredStreams,
                updated: Date.now(),
              }),
            );
          }
          if (!refreshStreamInfoTimer.current) {
            refreshStreamInfoTimer.current = setInterval(async () => {
              GetAndSetStreamInfo();
            }, 1000 * 60 * 1);
          }
        });
      }
    } catch (error) {
      console.log('onlineEvents -> error', error);
    }

    return () => {
      setFavion();
    };
  }, [streamInfo, channelName, addNoti, GetAndSetStreamInfo]);

  const playingEvents = useCallback(() => {
    console.log('playingEvents');
    if (twitchVideoPlayer) {
      setShowUIControlls(true);
    }
  }, [twitchVideoPlayer]);

  useEffect(() => {
    if (twitchVideoPlayer) {
      twitchVideoPlayer.addEventListener(window.Twitch.Player.ONLINE, onlineEvents);
      twitchVideoPlayer.addEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
      twitchVideoPlayer.addEventListener(window.Twitch.Player.PLAYING, playingEvents);
    }
    return () => {
      if (twitchVideoPlayer) {
        twitchVideoPlayer.removeEventListener(window.Twitch.Player.ONLINE, onlineEvents);
        twitchVideoPlayer.removeEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
        twitchVideoPlayer.removeEventListener(window.Twitch.Player.PLAYING, playingEvents);
      }
    };
  }, [onlineEvents, offlineEvents, playingEvents, twitchVideoPlayer]);

  useEffect(() => {
    (async () => {
      if (isLive.current && !streamInfo && channelName && twitchToken) {
        await GetAndSetStreamInfo().then(() => {
          if (!refreshStreamInfoTimer.current) {
            refreshStreamInfoTimer.current = setInterval(async () => {
              GetAndSetStreamInfo();
            }, 1000 * 60 * 1);
          }
        });
      }
    })();
  }, [channelName, twitchToken, streamInfo, GetAndSetStreamInfo]);

  const handleMouseOut = useCallback(() => {
    clearTimeout(fadeTimer.current);
    setShowControlls(false);
  }, []);

  function toggleFullScreen(e) {
    e.preventDefault();
    const video = videoElementRef.current;
    if (
      (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
    ) {
      if (hideChatDelay.current) clearTimeout(hideChatDelay.current);
      hideChatDelay.current = setTimeout(() => {
        setChatState((curr) => ({ ...curr, hideChat: true }));
      }, 5000);
      setIsFullscreen(true);
      if (video.requestFullScreen) {
        video.requestFullScreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else {
      if (hideChatDelay.current) clearTimeout(hideChatDelay.current);
      setChatState((curr) => ({ ...curr, hideChat: hideChatSaved.current }));
      setIsFullscreen(false);
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  const showAndResetTimer = throttle(
    () => {
      setShowControlls(true);
      clearTimeout(fadeTimer.current);

      fadeTimer.current = setTimeout(() => {
        setShowControlls(false);
      }, 2000);
    },
    250,
    { leading: true, trailing: false },
  );

  useEffect(() => {
    const keyboardEvents = (e) => {
      switch (e.key) {
        case 'f':
        case 'F':
          toggleFullScreen(e);
          break;
        default:
          break;
      }
    };

    const refEle = PlayerUIControlls.current;
    if (refEle) {
      refEle.addEventListener('mouseleave', handleMouseOut);
      document.addEventListener('mousemove', showAndResetTimer);
      document.addEventListener('mousedown', showAndResetTimer);
      document.body.addEventListener('keydown', showAndResetTimer);
      document.addEventListener('touchmove', showAndResetTimer);
      refEle.addEventListener('dblclick', toggleFullScreen);
      document.body.addEventListener('keydown', keyboardEvents);
      window.addEventListener('unload', removeFromStreamNotisFromPlayer);

      return () => {
        refEle.removeEventListener('mouseleave', handleMouseOut);
        document.removeEventListener('mousemove', showAndResetTimer);
        document.removeEventListener('mousedown', showAndResetTimer);
        document.body.removeEventListener('keydown', showAndResetTimer);
        document.removeEventListener('touchmove', showAndResetTimer);
        refEle.removeEventListener('dblclick', toggleFullScreen);
        document.body.removeEventListener('keydown', keyboardEvents);
        window.removeEventListener('unload', removeFromStreamNotisFromPlayer);
        clearTimeout(fadeTimer.current);
        removeFromStreamNotisFromPlayer();
      };
    }
  }, [handleMouseOut, removeFromStreamNotisFromPlayer, showAndResetTimer]);

  const handleResizeMouseDown = () => {
    setResizeActive(true);
  };

  const handleResizeMouseUp = (e) => {
    setResizeActive(false);
  };

  const resize = useCallback(
    // throttle(
    (e) => {
      if (resizeActive) {
        const mouseX = e.clientX;

        const newWidth = chatState.switchChatSide
          ? Math.min(Math.max(parseInt(mouseX), 10), window.innerWidth - 250)
          : Math.min(Math.max(parseInt(window.innerWidth - mouseX), 10), window.innerWidth - 250);

        setChatState((curr) => {
          return { ...curr, chatwidth: newWidth };
        });
        localStorage.setItem(
          'TwitchChatState',
          JSON.stringify({ ...chatState, chatwidth: newWidth }),
        );
      }
    },
    [resizeActive, chatState],
  );

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar
          channelName={channelName}
          type={videoId ? 'vod' : 'live'}
          streamInfo={streamInfo}
          twitchVideoPlayer={twitchVideoPlayer}
          setVisible={setVisible}
          visible={visible}
        />
      </CSSTransition>

      {channelName && !videoId ? (
        <VideoAndChatContainer
          onMouseUp={handleResizeMouseUp}
          onMouseMove={resize}
          chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
          resizeActive={resizeActive}
          switched={chatState.switchChatSide}
          style={{
            height: visible ? 'calc(100vh - 85px)' : '100vh',
            top: visible ? '85px' : '0',
          }}
          switchedChatState={String(chatState.switchChatSide)}
          hidechat={chatState.hideChat}
        >
          <div id='twitch-embed' ref={videoElementRef}>
            <CSSTransition
              in={showControlls}
              key={'controllsUI'}
              timeout={1000}
              classNames='fade-controllUI-1s'
            >
              <VolumeEventOverlay
                show={showUIControlls}
                ref={PlayerUIControlls}
                type='live'
                id='controls'
                hidechat={String(chatState.hideChat)}
                showcursor={showControlls}
                chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
              >
                {twitchVideoPlayer && (
                  <ContextMenu
                    DEFAULT_CHAT_WIDTH={DEFAULT_CHAT_WIDTH}
                    PlayerUIControlls={PlayerUIControlls.current}
                    type='live'
                    hidechat={String(chatState.hideChat)}
                    TwitchPlayer={twitchVideoPlayer}
                    showAndResetTimer={showAndResetTimer}
                    setChatState={setChatState}
                    children={
                      <>
                        <li
                          onClick={() => {
                            setChatState((curr) => ({ ...curr, hideChat: !curr.hideChat }));
                          }}
                        >
                          <MdChat size={24} />
                          {chatState.hideChat ? 'Show chat' : 'Hide chat'}
                        </li>

                        <li
                          onClick={() => {
                            localStorage.setItem(
                              'TwitchChatState',
                              JSON.stringify({
                                ...chatState,
                                switchChatSide: !chatState.switchChatSide,
                              }),
                            );
                            setChatState((curr) => ({
                              ...curr,
                              switchChatSide: !chatState.switchChatSide,
                            }));
                          }}
                        >
                          <MdCompareArrows size={24} />
                          Switch chat side
                        </li>
                      </>
                    }
                  />
                )}
                {streamInfo ? (
                  <InfoDisplay>
                    <>
                      <img src={streamInfo.profile_img_url} alt='' />
                      <div id='name'>
                        <Link
                          to={{
                            pathname: `channel`,
                            state: {
                              p_id: streamInfo && streamInfo.user_id,
                            },
                          }}
                        >
                          {streamInfo.user_name || channelName}
                        </Link>
                        <a
                          className='twitchRedirect'
                          alt=''
                          href={`https://www.twitch.tv/${streamInfo.user_name || channelName}`}
                        >
                          <FaTwitch size={30} color='purple' />
                        </a>

                        <FollowUnfollowBtn
                          channelName={streamInfo.user_name || channelName}
                          id={streamInfo.user_id || twitchVideoPlayer.getChannelId()}
                        />
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          delay={{ show: 500, hide: 0 }}
                          overlay={
                            <Tooltip
                              id={`tooltip-${'right'}`}
                            >{`${'Go to channel page incl. videos and clips'}`}</Tooltip>
                          }
                        >
                          <ChannelIconLink
                            to={{
                              pathname: `channel`,
                            }}
                          >
                            <MdAccountBox size={30} />
                          </ChannelIconLink>
                        </OverlayTrigger>
                      </div>
                      <p id='title'>{streamInfo.title || p_title}</p>
                      {streamInfo.game_name && (
                        <Link id='game' to={`/category/${streamInfo.game_name || p_game}`}>
                          Playing {streamInfo.game_name || p_game}
                        </Link>
                      )}
                    </>

                    {streamInfo.viewer_count && (
                      <AnimatedViewCount
                        id={'viewers'}
                        viewers={streamInfo.viewer_count}
                        disabeIcon={true}
                      />
                    )}
                    {streamInfo.started_at && (
                      <p id='uptime'>
                        Uptime{' '}
                        <Moment interval={1} durationFromNow>
                          {streamInfo.started_at}
                        </Moment>
                      </p>
                    )}
                  </InfoDisplay>
                ) : (
                  !getCookie('Twitch-access_token') && (
                    <ReAuthenticateButton
                      disconnect={() => disconnectTwitch({ setTwitchToken, setEnableTwitch })}
                      serviceName={'Twitch'}
                      style={{ margin: '20px' }}
                    />
                  )
                )}

                <SmallButtonContainer>
                  <PlayPauseButton
                    TwitchPlayer={twitchVideoPlayer}
                    PlayerUIControlls={PlayerUIControlls.current}
                  />
                  <VolumeSlider
                    OpenedDate={OpenedDate}
                    PlayerUIControlls={PlayerUIControlls.current}
                    TwitchPlayer={twitchVideoPlayer}
                    setShowControlls={setShowControlls}
                  />
                  <ShowStatsButtons TwitchPlayer={twitchVideoPlayer} />
                  <ShowSetQualityButtons TwitchPlayer={twitchVideoPlayer} />
                  <ClipButton streamInfo={streamInfo} />
                  <ResetVideoButton
                    title={'Refresh video'}
                    style={{
                      pointerEvents: !twitchVideoPlayer ? 'none' : 'unset',
                      opacity: !twitchVideoPlayer ? '0.2' : '0.7',
                    }}
                    onClick={() => {
                      console.log('Refreshing Twitch video');
                      videoElementRef.current.removeChild(document.querySelector('iframe'));
                      setTwitchVideoPlayer(
                        new window.Twitch.Player('twitch-embed', {
                          width: '100%',
                          height: '100%',
                          theme: 'dark',
                          layout: 'video',
                          channel: channelName && !videoId ? channelName : null,
                          video: videoId || null,
                          muted: false,
                          time: time.length >= 1 ? time : null,
                          allowfullscreen: true,
                          parent: ['aiofeed.com'],
                        }),
                      );
                    }}
                  />
                </SmallButtonContainer>

                {!isFullscreen ? (
                  <MdFullscreen
                    size={34}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={toggleFullScreen}
                    title='Fullsceen (f)'
                  />
                ) : (
                  <MdFullscreenExit
                    size={34}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={toggleFullScreen}
                    title='Fullsceen (f)'
                  />
                )}

                {!isFullscreen && (
                  <>
                    <ToggleSwitchChatSide
                      title='Switch chat side'
                      id='switchSides'
                      switched={String(chatState.switchChatSide)}
                      onClick={() => {
                        localStorage.setItem(
                          'TwitchChatState',
                          JSON.stringify({
                            ...chatState,
                            switchChatSide: !chatState.switchChatSide,
                          }),
                        );
                        setChatState((curr) => ({
                          ...curr,
                          switchChatSide: !chatState.switchChatSide,
                        }));
                      }}
                    />

                    <OpenCloseChat
                      chatState={chatState}
                      hideChat={chatState.hideChat}
                      switched={chatState.switchChatSide}
                      onClick={() => {
                        setChatState((current) => {
                          const newValue = !current.hideChat;
                          hideChatSaved.current = newValue;

                          localStorage.setItem(
                            'TwitchChatState',
                            JSON.stringify({ ...current, hideChat: newValue }),
                          );

                          return { ...current, hideChat: newValue };
                        });
                      }}
                    />
                  </>
                )}
              </VolumeEventOverlay>
            </CSSTransition>
            {!showUIControlls && (
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  delay={{ show: 500, hide: 0 }}
                  overlay={<Tooltip id={`tooltip-${'left'}`}>{`${'Switch chat side'}`}</Tooltip>}
                >
                  <ToggleSwitchChatSide
                    id='switchSides'
                    switched={String(chatState.switchChatSide)}
                    onClick={() => {
                      localStorage.setItem(
                        'TwitchChatState',
                        JSON.stringify({
                          ...chatState,
                          switchChatSide: !chatState.switchChatSide,
                        }),
                      );
                      setChatState((curr) => ({
                        ...curr,
                        switchChatSide: !chatState.switchChatSide,
                      }));
                    }}
                    style={{
                      right: chatState.switchChatSide
                        ? 'unset'
                        : chatState.hideChat
                        ? '10px'
                        : `calc(${chatState.chatwidth}px + 10px)`,
                      left: chatState.switchChatSide
                        ? chatState.hideChat
                          ? '10px'
                          : `calc(${chatState.chatwidth}px + 10px)`
                        : 'unset',
                    }}
                  />
                </OverlayTrigger>

                <OpenCloseChat
                  chatState={chatState}
                  hideChat={chatState.hideChat}
                  switched={chatState.switchChatSide}
                  onClick={() => {
                    setChatState((current) => {
                      const newValue = !current.hideChat;
                      hideChatSaved.current = newValue;
                      localStorage.setItem(
                        'TwitchChatState',
                        JSON.stringify({ ...current, hideChat: newValue }),
                      );
                      return { ...current, hideChat: newValue };
                    });
                  }}
                  style={{
                    right: chatState.switchChatSide
                      ? 'unset'
                      : chatState.hideChat
                      ? '10px'
                      : `calc(${chatState.chatwidth}px + 10px)`,
                    left: chatState.switchChatSide
                      ? chatState.hideChat
                        ? '10px'
                        : `calc(${chatState.chatwidth}px + 10px)`
                      : 'unset',
                  }}
                />
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  delay={{ show: 500, hide: 0 }}
                  overlay={
                    <Tooltip
                      id={`tooltip-${'right'}`}
                    >{`${'Go to channel page inc. videos and clips'}`}</Tooltip>
                  }
                >
                  <ChannelButton
                    variant='dark'
                    as={Link}
                    to={{
                      pathname: `channel`,
                    }}
                  >
                    Channel Page
                  </ChannelButton>
                </OverlayTrigger>
              </>
            )}
          </div>
          {!chatState.hideChat && (
            <ResizeDevider
              onMouseDown={handleResizeMouseDown}
              resizeActive={resizeActive}
              chatwidth={chatState.chatwidth}
            >
              <div />
            </ResizeDevider>
          )}
          {!chatState.hideChat ? (
            <>
              {resizeActive && (
                <ChatOverlay switched={chatState.switchChatSide} chatwidth={chatState.chatwidth} />
              )}
              <div id='chat'>
                <ShowNavbarBtn
                  variant='dark'
                  type='live'
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
                <StyledChat
                  frameborder='0'
                  scrolling='yes'
                  theme='dark'
                  id={channelName + '-chat'}
                  src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
                />
              </div>
            </>
          ) : (
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
          )}
        </VideoAndChatContainer>
      ) : videoId ? (
        <VideoAndChatContainer
          id='twitch-embed'
          style={{
            height: visible ? 'calc(100vh - 85px)' : '100vh',
            top: visible ? '85px' : '0',
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
      ) : (
        <p>Error?</p>
      )}
    </>
  );
};
