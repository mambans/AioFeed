import { CSSTransition } from 'react-transition-group';
import { throttle, debounce } from 'lodash';
import { useParams, useLocation, Link } from 'react-router-dom';
import Moment from 'react-moment';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';

import {
  MdFullscreen,
  MdCompareArrows,
  MdFullscreenExit,
  MdChat,
  MdAccountBox,
} from 'react-icons/md';
import { FaTwitch, FaInfoCircle } from 'react-icons/fa';
import { GrRefresh } from 'react-icons/gr';

import fetchStreamInfo from './fetchStreamInfo';
import FollowUnfollowBtn from '../FollowUnfollowBtn';
import NavigationContext from '../../navigation/NavigationContext';
import VolumeSlider from './VolumeSlider';
import {
  InfoDisplay,
  StyledChat,
  ToggleSwitchChatSide,
  VideoAndChatContainer,
  ResizeDevider,
  ChatOverlay,
  ResetVideoButton,
  SmallButtonContainer,
  ChannelIconLink,
  PlayerExtraButtons,
  TagsContainer,
} from './StyledComponents';
// import PlayerNavbar from './PlayerNavbar';
import setFavion from '../setFavion';
import PlayPauseButton from './PlayPauseButton';
import ShowStatsButtons, { latencyColorValue } from './ShowStatsButtons';
import ShowSetQualityButtons from './ShowSetQualityButtons';
import OpenCloseChat from './OpenCloseChat';
import addSystemNotification from '../live/addSystemNotification';
import NotificationsContext from '../../notifications/NotificationsContext';
import ClipButton from './ClipButton';
import addGameName from './addGameName';
import addProfileImg from './addProfileImg';
import fetchChannelInfo from './fetchChannelInfo';
import { getLocalstorage, setLocalStorage } from '../../../util';
import PlayerContextMenu from './ContextMenu';
import AnimatedViewCount from '../live/AnimatedViewCount';
import ReAuthenticateButton from '../../navigation/sidebar/ReAuthenticateButton';
import disconnectTwitch from '../disconnectTwitch';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from '../loginNameFormat';
import toggleFullscreenFunc from './toggleFullscreenFunc';
import useFullscreen from '../../../hooks/useFullscreen';
import ToolTip from '../../../components/tooltip/ToolTip';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import TwitchAPI from '../API';
import Schedule from '../schedule';
import VolumeEventOverlay from '../VolumeEventOverlay';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useFavicon from '../../../hooks/useFavicon';
import { TwitchContext } from '../useToken';
import { ContextMenuDropDown } from './ContextMenuWrapper';

const DEFAULT_CHAT_WIDTH = Math.max(window.innerWidth * 0.12, 175);

const Player = () => {
  const channelName = useParams()?.channelName;
  const { addNotification } = useContext(NotificationsContext);
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { twitchAccessToken, setTwitchAccessToken } = useContext(TwitchContext);

  const twitchVideoPlayer = useRef();
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

  // force refresh when streamer goes live?
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState();

  const savedStreamInfo = useRef();
  const PlayerUIControlls = useRef();
  const OpenedDate = useRef(Date.now());
  const fadeTimer = useRef();
  const refreshStreamInfoTimer = useRef();
  const videoElementRef = useRef();
  const hideChatDelay = useRef();
  const link0 = useRef();
  const link1 = useRef();
  const link2 = useRef();
  const link3 = useRef();

  useFullscreen();
  useDocumentTitle(`${streamInfo?.user_name || channelName} (${status || ''})`);
  useFavicon(streamInfo?.profile_image_url);

  useEventListenerMemo(window?.Twitch?.Player?.ONLINE, onlineEvents, twitchVideoPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.OFFLINE, offlineEvents, twitchVideoPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.PLAYING, playingEvents, twitchVideoPlayer.current);

  useEventListenerMemo('mouseleave', handleMouseOut, PlayerUIControlls.current);
  useEventListenerMemo('dblclick', toggleFullScreen, PlayerUIControlls.current);
  useEventListenerMemo('keydown', keyboardEvents);

  const containLinkClicks = (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  };

  const showAndResetTimer = throttle(
    () => {
      setShowControlls(true);
      clearTimeout(fadeTimer.current);

      fadeTimer.current = setTimeout(() => setShowControlls(false), 1250);
    },
    150,
    { leading: true, trailing: false }
  );

  useEventListenerMemo('mousemove', showAndResetTimer, PlayerUIControlls.current);
  useEventListenerMemo('mousedown', showAndResetTimer, PlayerUIControlls.current);
  useEventListenerMemo('touchmove', showAndResetTimer, PlayerUIControlls.current);

  useEventListenerMemo('mousedown', containLinkClicks, link0.current);
  useEventListenerMemo('mousedown', containLinkClicks, link1.current);
  useEventListenerMemo('mousedown', containLinkClicks, link2.current);
  useEventListenerMemo('mousedown', containLinkClicks, link3.current);

  const resetValues = () => {
    savedStreamInfo.current = null;
    setStreamInfo(null);
    // setFavion(null);
    setChatState({});
  };

  useEffect(() => {
    return () => resetValues();
  }, [channelName]);

  useEffect(() => {
    if (twitchVideoPlayer.current) {
      twitchVideoPlayer.current.setChannel(channelName);
    } else if (window?.Twitch?.Player) {
      twitchVideoPlayer.current = new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        channel: channelName,
        muted: false,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      });
    }

    return () => {
      clearInterval(refreshStreamInfoTimer.current);
      clearTimeout(fadeTimer.current);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName]);

  useEffect(() => {
    const updateCachedChatState = debounce(
      () => {
        const localstorageTwitchChatState = getLocalstorage('TwitchChatState') || {};

        setLocalStorage('TwitchChatState', {
          ...localstorageTwitchChatState,
          [channelName?.toLowerCase()]: chatState,
        });
      },
      500,
      { leading: false, trailing: true }
    );

    if (!chatState?.default) updateCachedChatState();

    return updateCachedChatState.cancel;
  }, [chatState, channelName]);

  function offlineEvents() {
    console.log('Stream is Offline');
    setTimeout(() => {
      clearInterval(refreshStreamInfoTimer.current);
      setShowUIControlls(false);
      setStreamInfo(null);
      setStatus('Offline');
    }, 0);
  }

  const GetAndSetStreamInfo = useCallback(async () => {
    if (twitchVideoPlayer.current) {
      const LIVEStreamInfo = {
        ...savedStreamInfo.current,
        ...(await fetchStreamInfo(
          twitchVideoPlayer.current.getChannelId()
            ? { user_id: twitchVideoPlayer.current.getChannelId() }
            : { user_login: channelName }
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
        setStreamInfo((c) => ({ ...c, ...streamWithGameAndProfile }));

        return streamWithGameAndProfile;
      } else {
        const streamWithGameAndProfile = await fetchChannelInfo(
          twitchVideoPlayer.current.getChannelId(),
          true
        );
        setStreamInfo((c) => ({ ...c, ...streamWithGameAndProfile }));
        return streamWithGameAndProfile;
      }
    }
  }, [channelName]);

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
    setStatus('Live');

    try {
      if (!refreshStreamInfoTimer.current && channelName) {
        refreshStreamInfoTimer.current = setInterval(async () => {
          GetAndSetStreamInfo();
        }, 1000 * 60 * 1);
      }

      await GetAndSetStreamInfo().then(async (res) => {
        setFavion(res?.profile_image_url);
        const tags = await TwitchAPI.getTags({ broadcaster_id: res.user_id }).then(
          (res) => res?.data?.data
        );
        setStreamInfo(() => ({ ...res, tags }));

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

    // return () => setFavion();
  }

  async function playingEvents() {
    if (twitchVideoPlayer.current) setShowUIControlls(true);
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
      case 'q':
      case 'Q':
        e.preventDefault();
        twitchVideoPlayer.current?.setQuality('chunked');
        break;
      default:
        break;
    }
  }

  const handleResizeMouseDown = () => setResizeActive(true);
  const handleResizeMouseUp = () => setResizeActive(false);
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

  const reloadVideoPlayer = () => {
    console.log('Refreshing Twitch video');
    videoElementRef.current.removeChild(document.querySelector('iframe'));
    if (window?.Twitch?.Player) {
      twitchVideoPlayer.current = new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        channel: channelName,
        muted: false,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      });
    }
  };

  const Stats = () => {
    const playbackStats = twitchVideoPlayer?.current?.getPlaybackStats();
    if (!playbackStats || !Object.keys(playbackStats).length) return null;

    return (
      <ContextMenuDropDown
        trigger={
          <>
            <FaInfoCircle size={20} />
            Video stats
          </>
        }
      >
        {Object.keys(playbackStats)?.map((statName) => (
          <div key={statName}>
            <span>{`${statName}: `}</span>
            <span
              style={{
                color: latencyColorValue(statName, playbackStats?.[statName]),
              }}
            >
              {playbackStats?.[statName]}
            </span>
          </div>
        ))}
      </ContextMenuDropDown>
    );
  };

  return (
    <VideoAndChatContainer
      chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
      resizeActive={resizeActive}
      switched={chatState.switchChatSide}
      visible={visible}
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
            VolumeEventOverlayRef={PlayerUIControlls}
            player={twitchVideoPlayer.current}
            ContextMenu={
              Boolean(twitchVideoPlayer.current) && (
                <PlayerContextMenu
                  DEFAULT_CHAT_WIDTH={DEFAULT_CHAT_WIDTH}
                  PlayerUIControlls={PlayerUIControlls.current}
                  hidechat={String(chatState.hideChat)}
                  TwitchPlayer={twitchVideoPlayer.current}
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
                      <Stats />
                      <li onClick={reloadVideoPlayer}>
                        <GrRefresh size={24} />
                        Reload Videoplayer
                      </li>
                    </>
                  }
                />
              )
            }
          >
            {streamInfo ? (
              <InfoDisplay>
                <>
                  <img src={streamInfo?.profile_image_url} alt='' />
                  <div id='name'>
                    <Link
                      ref={link2}
                      to={{
                        pathname: `page`,
                        state: {
                          p_id: streamInfo?.user_id,
                        },
                      }}
                    >
                      {loginNameFormat(streamInfo || { data: channelName })}
                    </Link>
                    <a
                      className='twitchRedirect'
                      alt=''
                      ref={link1}
                      href={`https://www.twitch.tv/${
                        streamInfo?.user_name || channelName
                      }?redirect=false`}
                    >
                      <FaTwitch size={24} color='purple' />
                    </a>

                    <FollowUnfollowBtn
                      channelName={streamInfo?.user_name || channelName}
                      id={streamInfo.user_id || twitchVideoPlayer.current.getChannelId()}
                    />

                    <VodsFollowUnfollowBtn
                      size={28}
                      channel={streamInfo?.user_name || channelName}
                      channelId={streamInfo.user_id}
                      marginright='5px;'
                    />

                    <AddUpdateNotificationsButton
                      channel={streamInfo?.user_name || channelName}
                      marginright='5px;'
                      size={26}
                    />

                    <ToolTip
                      placement={'right'}
                      delay={{ show: 500, hide: 0 }}
                      tooltip='Go to channel page incl. videos and clips'
                      width='max-content'
                    >
                      <ChannelIconLink
                        to={{
                          pathname: `page`,
                        }}
                        ref={link0}
                      >
                        <MdAccountBox size={30} />
                      </ChannelIconLink>
                    </ToolTip>
                  </div>
                  <p id='title'>{streamInfo?.title}</p>
                  {streamInfo?.game_name && (
                    <span id='game'>
                      {'Playing '}
                      <Link ref={link3} to={`/category/${streamInfo?.game_name}`}>
                        {streamInfo?.game_name}
                      </Link>
                    </span>
                  )}
                </>
                {streamInfo?.viewer_count && (
                  <AnimatedViewCount
                    id={'viewers'}
                    viewers={streamInfo?.viewer_count}
                    disabeIcon={true}
                  />
                )}
                {streamInfo?.started_at && (
                  <p id='uptime'>
                    Uptime{' '}
                    <Moment interval={1} durationFromNow>
                      {streamInfo?.started_at}
                    </Moment>
                  </p>
                )}
                {streamInfo?.tags && (
                  <TagsContainer id={'tags'}>
                    {streamInfo.tags.map((tag) => {
                      const lang = window.navigator.language?.toLowerCase();
                      return (
                        <ToolTip
                          placement={'bottom'}
                          delay={{ show: 500, hide: 0 }}
                          tooltip={tag.localization_descriptions[lang]}
                          width='max-content'
                          key={tag.tag_id}
                        >
                          <a href={`https://www.twitch.tv/directory/all/tags/${tag.tag_id}`}>
                            {tag.localization_names[lang]}
                          </a>
                        </ToolTip>
                      );
                    })}
                  </TagsContainer>
                )}
              </InfoDisplay>
            ) : (
              !twitchAccessToken && (
                <ReAuthenticateButton
                  disconnect={() => disconnectTwitch({ setTwitchAccessToken })}
                  serviceName={'Twitch'}
                  style={{ margin: '20px' }}
                />
              )
            )}

            {Boolean(twitchVideoPlayer.current) && (
              <SmallButtonContainer>
                <PlayPauseButton
                  TwitchPlayer={twitchVideoPlayer.current}
                  PlayerUIControlls={PlayerUIControlls.current}
                />
                <VolumeSlider
                  OpenedDate={OpenedDate}
                  PlayerUIControlls={PlayerUIControlls.current}
                  TwitchPlayer={twitchVideoPlayer.current}
                  setShowControlls={setShowControlls}
                  showAndResetTimer={showAndResetTimer}
                />
                <ShowStatsButtons TwitchPlayer={twitchVideoPlayer.current} />
                <ShowSetQualityButtons TwitchPlayer={twitchVideoPlayer.current} />
                <ClipButton streamInfo={streamInfo} />
                <ResetVideoButton
                  title={'Reload video'}
                  style={{
                    pointerEvents: !twitchVideoPlayer.current ? 'none' : 'unset',
                    opacity: !twitchVideoPlayer.current ? '0.2' : '0.7',
                  }}
                  onClick={reloadVideoPlayer}
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
            <ToolTip
              placement={'left'}
              width='max-content'
              delay={{ show: 500, hide: 0 }}
              tooltip='Switch chat side'
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
            </ToolTip>

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
        <ResizeDevider onMouseDown={handleResizeMouseDown} resizeActive={resizeActive}>
          <div />
        </ResizeDevider>
      )}
      {!chatState.hideChat ? (
        <>
          <div id='chat'>
            <PlayerExtraButtons channelName={channelName}>
              <Schedule
                user={streamInfo?.user_name || channelName}
                user_id={streamInfo?.user_id}
                absolute={false}
              />
            </PlayerExtraButtons>
            <StyledChat
              frameborder='0'
              scrolling='yes'
              theme='dark'
              id={channelName + '-chat'}
              src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
            />
          </div>
          {resizeActive && (
            <ChatOverlay
              onMouseUp={handleResizeMouseUp}
              onMouseMove={resize}
              switched={chatState.switchChatSide}
            />
          )}
        </>
      ) : (
        <PlayerExtraButtons channelName={channelName}></PlayerExtraButtons>
      )}
    </VideoAndChatContainer>
  );
};
export default Player;