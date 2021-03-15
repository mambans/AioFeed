import { CSSTransition } from 'react-transition-group';
import { throttle, debounce } from 'lodash';
import { useParams, useLocation, Link } from 'react-router-dom';
import Moment from 'react-moment';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  MdFullscreen,
  MdCompareArrows,
  MdFullscreenExit,
  MdChat,
  MdAccountBox,
} from 'react-icons/md';
import { FaTwitch } from 'react-icons/fa';

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
  ResizeDevider,
  ChatOverlay,
  ResetVideoButton,
  SmallButtonContainer,
  ChannelIconLink,
  OfflineOverlay,
  PlayerExtraButtons,
} from './StyledComponents';
// import PlayerNavbar from './PlayerNavbar';
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
import disconnectTwitch from '../disconnectTwitch';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from '../loginNameFormat';
import toggleFullscreenFunc from './toggleFullscreenFunc';
import useToken from '../useToken';
import useFullscreen from '../../../hooks/useFullscreen';

const DEFAULT_CHAT_WIDTH = Math.max(window.innerWidth * 0.1, 175);

export default () => {
  const channelName = useParams()?.channelName;
  const validateToken = useToken();
  const { addNotification } = useContext(NotificationsContext);
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { setTwitchToken } = useContext(AccountContext);

  const [twitchVideoPlayer, setTwitchVideoPlayer] = useState();
  const [streamInfo, setStreamInfo] = useState(useLocation().state?.passedChannelData);
  const [showControlls, setShowControlls] = useState();
  const [showUIControlls, setShowUIControlls] = useState();
  const [chatState, setChatState] = useState({
    chatwidth: DEFAULT_CHAT_WIDTH,
    switchChatSide: false,
    hideChat: false,
    ...(getLocalstorage('TwitchChatState')?.[channelName?.toLowerCase()] || {}),
    default: true,
  });

  const hideChatSaved = useRef(
    getLocalstorage('TwitchChatState')?.[channelName?.toLowerCase()]?.hideChat || false
  );
  const [isFullscreen, setIsFullscreen] = useState();
  const [resizeActive, setResizeActive] = useState(false);

  const savedStreamInfo = useRef();
  const PlayerUIControlls = useRef();
  const OpenedDate = useRef(Date.now());
  const fadeTimer = useRef();
  const refreshStreamInfoTimer = useRef();
  const videoElementRef = useRef();
  const hideChatDelay = useRef();
  const isLive = useRef();
  const link0 = useRef();
  const link1 = useRef();
  const link2 = useRef();
  const link3 = useRef();

  useFullscreen();

  useEventListenerMemo(window.Twitch.Player.ONLINE, onlineEvents, twitchVideoPlayer);
  useEventListenerMemo(window.Twitch.Player.OFFLINE, offlineEvents, twitchVideoPlayer);
  useEventListenerMemo(window.Twitch.Player.PLAYING, playingEvents, twitchVideoPlayer);

  useEventListenerMemo('mouseleave', handleMouseOut, PlayerUIControlls.current);
  useEventListenerMemo('dblclick', toggleFullScreen, PlayerUIControlls.current);
  useEventListenerMemo('keydown', keyboardEvents);
  useEventListenerMemo('mousedown', containLinkClicks, link0.current);
  useEventListenerMemo('mousedown', containLinkClicks, link1.current);
  useEventListenerMemo('mousedown', containLinkClicks, link2.current);
  useEventListenerMemo('mousedown', containLinkClicks, link3.current);

  function containLinkClicks(event) {
    event.stopPropagation();
  }

  const showAndResetTimer = throttle(
    () => {
      setShowControlls(true);
      clearTimeout(fadeTimer.current);

      fadeTimer.current = setTimeout(() => setShowControlls(false), 2000);
    },
    150,
    { leading: true, trailing: false }
  );

  useEventListenerMemo('mousemove', showAndResetTimer);
  useEventListenerMemo('mousedown', showAndResetTimer);
  useEventListenerMemo('touchmove', showAndResetTimer);

  useEffect(() => {
    document.title = `${channelName} player`;
  }, [channelName]);

  useEffect(() => {
    setTwitchVideoPlayer(
      new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        channel: channelName,
        muted: false,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      })
    );

    return () => {
      clearInterval(refreshStreamInfoTimer.current);
      clearTimeout(fadeTimer.current);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName]);

  useEffect(() => {
    const updateCachedChatState = debounce(
      () => {
        const localstorageTwitchChatState = getLocalstorage('TwitchChatState') || {};

        localStorage.setItem(
          'TwitchChatState',
          JSON.stringify({
            ...localstorageTwitchChatState,
            [channelName?.toLowerCase()]: chatState,
          })
        );
      },
      500,
      { leading: false, trailing: true }
    );

    if (!chatState?.default) updateCachedChatState();

    return updateCachedChatState.cancel;
  }, [chatState, channelName]);

  function offlineEvents() {
    console.log('Stream is Offline');
    document.title = `${channelName} (Offline)`;
    isLive.current = false;
    setShowUIControlls(false);
    clearInterval(refreshStreamInfoTimer.current);
    setStreamInfo(null);
  }

  const GetAndSetStreamInfo = useCallback(async () => {
    if (twitchVideoPlayer) {
      const LIVEStreamInfo = {
        ...savedStreamInfo.current,
        ...(await validateToken().then(() =>
          fetchStreamInfo(
            twitchVideoPlayer.getChannelId()
              ? { user_id: twitchVideoPlayer.getChannelId() }
              : { user_login: channelName }
          )
        )),
      };

      if (Object.keys(LIVEStreamInfo).length !== 0 && LIVEStreamInfo.constructor === Object) {
        const streamWithGame = await addGameName({
          streamInfo: savedStreamInfo.current,
          newStreamInfo: LIVEStreamInfo,
        });

        const streamWithGameAndProfile = await addProfileImg({
          user_id: LIVEStreamInfo.user_id,
          currentStreamObj: streamWithGame,
        });

        savedStreamInfo.current = streamWithGameAndProfile;
        setStreamInfo(streamWithGameAndProfile);

        return streamWithGameAndProfile;
      } else {
        const streamWithGameAndProfile = await validateToken().then(() =>
          fetchChannelInfo(twitchVideoPlayer.getChannelId(), true)
        );
        setStreamInfo(streamWithGameAndProfile);
        return streamWithGameAndProfile;
      }
    }
  }, [twitchVideoPlayer, channelName, validateToken]);

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
    [addNotification]
  );

  async function onlineEvents() {
    console.log('Stream is Online');
    isLive.current = true;
    document.title = `${channelName}`;

    try {
      if (!refreshStreamInfoTimer.current && channelName) {
        refreshStreamInfoTimer.current = setInterval(async () => {
          GetAndSetStreamInfo();
        }, 1000 * 60 * 1);
      }

      await GetAndSetStreamInfo().then((res) => {
        setFavion(res?.profile_image_url);
        if (
          streamInfo === null &&
          res?.broadcaster_software &&
          !res?.broadcaster_software?.toLowerCase().includes('rerun')
        ) {
          addNoti({ type: 'Live', stream: res });
        }
      });
    } catch (error) {
      console.log('onlineEvents -> error', error);
    }

    return () => {
      setFavion();
    };
  }

  function playingEvents() {
    if (twitchVideoPlayer) setShowUIControlls(true);
  }

  function handleMouseOut() {
    clearTimeout(fadeTimer.current);
    setShowControlls(false);
  }

  function toggleFullScreen(event) {
    toggleFullscreenFunc({
      event,
      videoElementRef,
      setChatState,
      hideChatDelay,
      hideChatSaved,
      setIsFullscreen,
    });
  }

  function keyboardEvents(e) {
    switch (e.key) {
      case 'f':
      case 'F':
        toggleFullScreen(e);
        break;
      default:
        break;
    }
  }

  const handleResizeMouseDown = () => setResizeActive(true);
  const handleResizeMouseUp = (e) => setResizeActive(false);
  const resize = useCallback(
    (e) => {
      if (resizeActive) {
        const mouseX = e.clientX;

        const newWidth = chatState.switchChatSide
          ? Math.min(Math.max(parseInt(mouseX), 10), window.innerWidth - 250)
          : Math.min(Math.max(parseInt(window.innerWidth - mouseX), 10), window.innerWidth - 250);

        setChatState((curr) => {
          delete curr?.default;
          return { ...curr, chatwidth: newWidth };
        });
      }
    },
    [resizeActive, chatState]
  );

  return (
    <VideoAndChatContainer
      onMouseUp={handleResizeMouseUp}
      onMouseMove={resize}
      chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
      resizeActive={resizeActive}
      switched={chatState.switchChatSide}
      visible={visible}
      switchedChatState={String(chatState.switchChatSide)}
      hidechat={chatState.hideChat}
    >
      {streamInfo === null && !showUIControlls && !isLive.current && (
        <OfflineOverlay
          type='live'
          hidechat={String(chatState.hideChat)}
          chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
        >
          <Link to='page'>Offline</Link>
        </OfflineOverlay>
      )}
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
            {Boolean(twitchVideoPlayer) && (
              <ContextMenu
                DEFAULT_CHAT_WIDTH={DEFAULT_CHAT_WIDTH}
                PlayerUIControlls={PlayerUIControlls.current}
                type='live'
                hidechat={String(chatState.hideChat)}
                TwitchPlayer={twitchVideoPlayer}
                showAndResetTimer={showAndResetTimer}
                setChatState={setChatState}
                chatState={chatState}
                channelName={channelName}
                children={
                  <>
                    <li
                      onClick={() => {
                        setChatState((curr) => {
                          delete curr?.default;
                          return { ...curr, hideChat: !curr.hideChat };
                        });
                      }}
                    >
                      <MdChat size={24} />
                      {chatState.hideChat ? 'Show chat' : 'Hide chat'}
                    </li>

                    <li
                      onClick={() => {
                        setChatState((curr) => {
                          delete curr?.default;
                          return {
                            ...curr,
                            switchChatSide: !chatState.switchChatSide,
                          };
                        });
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
                  <img src={streamInfo.profile_image_url} alt='' />
                  <div id='name'>
                    <Link
                      ref={link2}
                      to={{
                        pathname: `page`,
                        state: {
                          p_id: streamInfo.user_id,
                        },
                      }}
                    >
                      {loginNameFormat(streamInfo || { data: channelName })}
                    </Link>
                    <a
                      className='twitchRedirect'
                      alt=''
                      ref={link1}
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
                          pathname: `page`,
                        }}
                        ref={link0}
                      >
                        <MdAccountBox size={30} />
                      </ChannelIconLink>
                    </OverlayTrigger>
                  </div>
                  <p id='title'>{streamInfo.title}</p>
                  {streamInfo.game_name && (
                    <span id='game'>
                      {'Playing '}
                      <Link ref={link3} to={`/category/${streamInfo.game_name}`}>
                        {streamInfo.game_name}
                      </Link>
                    </span>
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
                  disconnect={() => disconnectTwitch({ setTwitchToken })}
                  serviceName={'Twitch'}
                  style={{ margin: '20px' }}
                />
              )
            )}

            {Boolean(twitchVideoPlayer) && (
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
                  showAndResetTimer={showAndResetTimer}
                />
                <ShowStatsButtons TwitchPlayer={twitchVideoPlayer} />
                <ShowSetQualityButtons TwitchPlayer={twitchVideoPlayer} />
                <ClipButton streamInfo={streamInfo} validateToken={validateToken} />
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
                        channel: channelName,
                        muted: false,
                        allowfullscreen: true,
                        parent: ['aiofeed.com'],
                      })
                    );
                  }}
                />
              </SmallButtonContainer>
            )}

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
                    setChatState((curr) => {
                      delete curr?.default;
                      return {
                        ...curr,
                        switchChatSide: !chatState.switchChatSide,
                      };
                    });
                  }}
                />

                <OpenCloseChat
                  chatState={chatState}
                  hideChat={chatState.hideChat}
                  switched={chatState.switchChatSide}
                  onClick={() => {
                    setChatState((curr) => {
                      const newValue = !curr.hideChat;
                      hideChatSaved.current = newValue;
                      delete curr?.default;

                      return { ...curr, hideChat: newValue };
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
                  setChatState((curr) => {
                    delete curr?.default;
                    return {
                      ...curr,
                      switchChatSide: !chatState.switchChatSide,
                    };
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
            </OverlayTrigger>

            <OpenCloseChat
              chatState={chatState}
              hideChat={chatState.hideChat}
              switched={chatState.switchChatSide}
              onClick={() => {
                setChatState((curr) => {
                  const newValue = !curr.hideChat;
                  hideChatSaved.current = newValue;
                  delete curr?.default;
                  return { ...curr, hideChat: newValue };
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
            <PlayerExtraButtons channelName={channelName}></PlayerExtraButtons>
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
        <PlayerExtraButtons channelName={channelName}></PlayerExtraButtons>
      )}
    </VideoAndChatContainer>
  );
};
