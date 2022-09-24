import { CSSTransition } from 'react-transition-group';
import throttle from 'lodash/throttle';
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
import VolumeSlider from './VolumeSlider';
import {
  InfoDisplay,
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
import addSystemNotification from '../live/addSystemNotification';
import NotificationsContext from '../../notifications/NotificationsContext';
import ClipButton from './ClipButton';
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
import addGameInfo from '../functions/addGameInfo';
import addProfileInfo from '../functions/addProfileInfo';
import PlayerButtonsBar from './PlayerButtonsBar';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { footerVisibleAtom, navigationBarVisibleAtom } from '../../navigation/atoms';

const DEFAULT_CHAT_WIDTH = Math.max(window.innerWidth * 0.12, 175);

const Player = () => {
  const channelName = useParams()?.channelName;
  const { addNotification } = useContext(NotificationsContext);
  const navigationBarVisible = useRecoilValue(navigationBarVisibleAtom);
  const setFooterVisible = useSetRecoilState(footerVisibleAtom);

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
  const pushStatesTimer = useRef();

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

  const resetValues = () => {
    savedStreamInfo.current = null;
    setStreamInfo(null);
    setChatState({});
  };

  const pushChatState = useCallback(
    async (chatData = chatState) => {
      console.log('pushChatState:');
      await API.updateChateState({
        data: chatData,
        channel_id: channeId,
      }).catch((er) => {
        console.log('er:', er);
      });
    },
    [chatState, channeId]
  );

  const updateChatState = useCallback(
    (v, push = true) => {
      setChatState((c) => {
        clearTimeout(pushStatesTimer.current);

        if (typeof v === 'function') {
          const value = v(c);
          if (push) pushStatesTimer.current = setTimeout(() => pushChatState(value), 7500);
          return value;
        }

        if (push) pushStatesTimer.current = setTimeout(() => pushChatState(v), 7500);
        // pushChatState(v);
        return v;
      });
    },
    [pushChatState]
  );

  const resetChatState = () => {
    API.deleteChateState({ channel_id: channeId });
    setChatState({
      chatwidth: DEFAULT_CHAT_WIDTH,
      switchChatSide: false,
      hideChat: false,
      chatAsOverlay: false,
      overlayPosition: {},
    });
  };

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
        controlls: false,
        parent: ['aiofeed.com'],
      });
    }

    return () => {
      clearInterval(refreshStreamInfoTimer.current);
      clearTimeout(fadeTimer.current);
    };
  }, [setFooterVisible, channelName]);

  function offlineEvents() {
    console.log('Stream is Offline');
    clearInterval(refreshStreamInfoTimer.current);
    // setShowUIControlls(false);
    setStreamInfo((c) => ({ ...c, viewer_count: null, started_at: null }));
    setStatus('Offline');
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
        const streamWithGame = await addGameInfo({
          items: [LIVEStreamInfo],
          save: true,
        });

        const streamWithGameAndProfile = await addProfileInfo({
          items: streamWithGame,
          save: true,
        });

        savedStreamInfo.current = streamWithGameAndProfile?.[0];
        setStreamInfo((c) => ({ ...c, ...streamWithGameAndProfile?.[0] }));

        return streamWithGameAndProfile?.[0];
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
          title: `${loginNameFormat(stream)} is Live`,
          icon: stream?.profile_image_url,
          body: `${stream.title}\n${stream.game_name || ''}`,
          onClick: (e) => {
            e.preventDefault();
            window.open(
              `https://aiofeed.com/${stream.login || stream.user_login || stream.user_name}`
            );
          },
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
        {Object?.keys(playbackStats)?.map((statName) => (
          <div key={statName} style={{ cursor: 'none' }}>
            <span>{`${statName}: `}</span>
            <span
              style={{
                color: latencyColorValue(statName, playbackStats?.[statName]),
              }}
            >
              {playbackStats?.[statName]}
            </span>
          </div>
        )) || null}
      </ContextMenuDropDown>
    );
  };

  return (
    <VideoAndChatContainer
      chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
      resizeActive={resizeActive}
      switched={chatState.switchChatSide}
      visible={navigationBarVisible}
      switchedChatState={String(chatState.switchChatSide)}
      hidechat={chatState.hideChat}
      chatAsOverlay={chatState.chatAsOverlay}
    >
      <div id='twitch-embed' ref={videoElementRef}>
        <CSSTransition
          in={showControlls || status !== 'Live'}
          key={'controllsUI'}
          timeout={showControlls || status !== 'Live' ? 500 : 250}
          classNames='fade-controllUI'
        >
          <VolumeEventOverlay
            show={showUIControlls || status !== 'Live'}
            ref={PlayerUIControlls}
            type='live'
            id='controls'
            hidechat={String(chatState.hideChat)}
            showcursor={showControlls}
            isFullscreen={isFullscreen}
            chatwidth={chatState.chatwidth || DEFAULT_CHAT_WIDTH}
            VolumeEventOverlayRef={PlayerUIControlls}
            player={twitchVideoPlayer.current}
            chatAsOverlay={String(chatState.chatAsOverlay)}
            hidePointerEvents={status !== 'Live'}
            // addEventListeners
            ContextMenu={
              Boolean(twitchVideoPlayer.current) && (
                <PlayerContextMenu
                  PlayerUIControlls={PlayerUIControlls.current}
                  hidechat={String(chatState.hideChat)}
                  TwitchPlayer={twitchVideoPlayer.current}
                  showAndResetTimer={showAndResetTimer}
                  children={
                    <>
                      <div
                        onClick={() => {
                          updateChatState((curr) => ({
                            ...curr,
                            hideChat: !curr.hideChat,
                          }));
                        }}
                      >
                        <MdChat size={24} />
                        {chatState.hideChat ? 'Show chat' : 'Hide chat'}
                      </div>
                      <Stats />

                      <div
                        onClick={() => {
                          updateChatState((curr) => ({
                            ...curr,
                            switchChatSide: !chatState.switchChatSide,
                          }));
                        }}
                      >
                        <MdCompareArrows size={24} />
                        Switch chat side
                      </div>

                      <br />
                      <div onClick={resetChatState}>
                        <GrRefresh size={24} />
                        Reset chat position
                      </div>
                      <div onClick={reloadVideoPlayer}>
                        <GrRefresh size={24} />
                        Reload Videoplayer
                      </div>
                      <div onClick={reloadChat}>
                        <GrRefresh size={24} />
                        Reload Chat
                      </div>
                    </>
                  }
                />
              )
            }
          >
            <PlayerButtonsBar
              style={{ margin: '1rem', position: 'absolute', right: 0, top: 0 }}
              user={{
                user_name:
                  streamInfo?.login ||
                  streamInfo?.user_login ||
                  streamInfo?.user_name ||
                  channelName,
                ...(streamInfo || {}),
              }}
              schedule={true}
            />

            {streamInfo ? (
              <InfoDisplay>
                <>
                  <img className='profile' src={streamInfo?.profile_image_url} alt='' />
                  <div id='name'>
                    <Link
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
                      href={`https://www.twitch.tv/${
                        streamInfo?.login ||
                        streamInfo?.user_login ||
                        streamInfo?.user_name ||
                        channelName
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
                      channel={streamInfo}
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
                      >
                        <MdAccountBox size={30} />
                      </ChannelIconLink>
                    </ToolTip>
                  </div>
                  <p id='title'>{streamInfo?.title}</p>
                  {streamInfo?.game_name && (
                    <span id='game'>
                      {'Playing '}
                      <Link to={`/category/${streamInfo?.game_name}`}>
                        {streamInfo?.game_name}{' '}
                        <img
                          src={streamInfo?.game_img
                            ?.replace('{width}', 130)
                            ?.replace('{height}', 173)}
                          alt=''
                        />
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
          </VolumeEventOverlay>
        </CSSTransition>
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
