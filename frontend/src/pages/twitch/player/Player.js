import { CSSTransition } from 'react-transition-group';
import { throttle } from 'lodash';
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
import VolumeEventOverlay from '../VolumeEventOverlay';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useFavicon from '../../../hooks/useFavicon';
import { TwitchContext } from '../useToken';
import { ContextMenuDropDown } from './ContextMenuWrapper';
import Chat from './Chat';
import API from '../../navigation/API';

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
  const [channeId, setChanneId] = useState();
  const [chatState, setChatState] = useState({
    chatwidth: DEFAULT_CHAT_WIDTH,
    switchChatSide: false,
    hideChat: false,
    chatAsOverlay: false,
    overlayPosition: {},
  });

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
  useDocumentTitle(`${streamInfo?.user_name || channelName} ${status ? `(${status || ''})` : ''}`);
  useFavicon(streamInfo?.profile_image_url);

  const ready = (e) => {
    console.log('Player is ready');
  };

  useEventListenerMemo(window?.Twitch?.Player?.READY, ready, twitchVideoPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.ONLINE, onlineEvents, twitchVideoPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.OFFLINE, offlineEvents, twitchVideoPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.PLAYING, playingEvents, twitchVideoPlayer.current);

  useEventListenerMemo('mouseleave', handleMouseOut, PlayerUIControlls.current);
  useEventListenerMemo('dblclick', toggleFullScreen, PlayerUIControlls.current);
  useEventListenerMemo('keydown', keyboardEvents, PlayerUIControlls.current);

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
    setChatState({});
  };

  const pushChatState = useCallback(
    async (chatData = chatState) => {
      console.log('channeId:', channeId);
      console.log('pushChatState:');
      const saved_chatstate = await API.updateChateState({
        data: chatData,
        channel_id: channeId,
      }).catch((er) => {
        console.log('er:', er);
      });
      console.log('saved_chatstate:', saved_chatstate);
    },
    [chatState, channeId]
  );

  const updateChatState = useCallback(
    (v) => {
      setChatState((c) => {
        if (typeof v === 'function') {
          const value = v(c);
          pushChatState(value);
          return value;
        }

        if (v && typeof v === 'object') {
          const newChatState = { ...c, ...v };
          pushChatState(newChatState);
          return newChatState;
        }

        pushChatState(v);
        return v;
      });
    },
    [pushChatState]
  );

  useEffect(() => {
    (async () => {
      const channel = await TwitchAPI.getUser({
        login: channelName,
      })
        .then((res) => res.data.data[0])
        .catch((error) => 'Not Found');
      console.log('channel.id:', channel?.id);

      if (channel?.id) {
        setChanneId(channel?.id);
        const chatStateData = await API.getChatState({ channel_id: channel?.id });
        console.log('chatStateData:', chatStateData);

        if (chatStateData) setChatState(chatStateData);
      }
    })();

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
        const tags = await TwitchAPI.getTags({ broadcaster_id: res?.user_id }).then(
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
      case 'Escape':
        setResizeActive(false);
        break;
      default:
        break;
    }
  }

  const handleResizeMouseDown = () => setResizeActive(true);
  const handleResizeMouseUp = () => {
    setResizeActive(false);
    pushChatState();
  };
  const resize = useCallback(
    (e) => {
      if (resizeActive) {
        const mouseX = e.clientX;

        const newWidth = chatState.switchChatSide
          ? Math.min(Math.max(parseInt(mouseX), 10), window.innerWidth - 250)
          : Math.min(Math.max(parseInt(window.innerWidth - mouseX), 10), window.innerWidth - 250);

        setChatState((curr) => {
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
  const reloadChat = () => {
    setChatState((c) => ({ ...c, hideChat: true }));
    setTimeout(() => {
      setChatState((c) => ({ ...c, hideChat: false }));
    }, 0);
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
      chatAsOverlay={chatState.chatAsOverlay}
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
                  updateChatState={updateChatState}
                  children={
                    <>
                      <li
                        onClick={() => {
                          updateChatState((curr) => {
                            return { ...curr, hideChat: !curr.hideChat };
                          });
                        }}
                      >
                        <MdChat size={24} />
                        {chatState.hideChat ? 'Show chat' : 'Hide chat'}
                      </li>

                      <li
                        onClick={() => {
                          updateChatState((curr) => {
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
                      <li onClick={reloadChat}>
                        <GrRefresh size={24} />
                        Reload Chat
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
                        streamInfo?.login || streamInfo?.user_name || channelName
                      }?redirect=false`}
                    >
                      <FaTwitch size={24} color='purple' />
                    </a>

                    <FollowUnfollowBtn
                      channelName={streamInfo?.user_name || channelName}
                      id={streamInfo.user_id || twitchVideoPlayer.current.getChannelId()}
                    />

                    <VodsFollowUnfollowBtn size={28} channel={streamInfo} marginright='5px;' />

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

            <SmallButtonContainer>
              {Boolean(twitchVideoPlayer.current) && (
                <>
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
                </>
              )}
              <ResetVideoButton
                title={'Reload video'}
                style={{
                  pointerEvents: !twitchVideoPlayer.current ? 'none' : 'unset',
                  opacity: !twitchVideoPlayer.current ? '0.2' : '0.7',
                }}
                onClick={reloadVideoPlayer}
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
                    updateChatState((curr) => {
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
                    updateChatState((curr) => {
                      const newValue = !curr.hideChat;
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
                  updateChatState((curr) => {
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
                updateChatState((curr) => {
                  const newValue = !curr.hideChat;

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
      {!chatState.hideChat && !chatState?.chatAsOverlay && (
        <ResizeDevider onMouseDown={handleResizeMouseDown} resizeActive={resizeActive}>
          <div />
        </ResizeDevider>
      )}
      {!chatState.hideChat ? (
        <>
          <Chat
            streamInfo={streamInfo}
            channelName={channelName}
            chatAsOverlay={chatState.chatAsOverlay}
            chatState={chatState}
            updateChatState={updateChatState}
          />

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
