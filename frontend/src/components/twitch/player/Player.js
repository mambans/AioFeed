import { CSSTransition } from "react-transition-group";
import { throttle } from "lodash";
import { useParams, useLocation, Link } from "react-router-dom";
import Moment from "react-moment";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";

import { MdVerticalAlignBottom } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";

import fetchStreamInfo from "./fetchStreamInfo";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import NavigationContext from "./../../navigation/NavigationContext";
import VolumeSlider from "./VolumeSlider";
import {
  InfoDisplay,
  StyledChat,
  ToggleSwitchChatSide,
  VideoAndChatContainer,
  VolumeEventOverlay,
  ShowNavbarBtn,
} from "./StyledComponents";
import PlayerNavbar from "./PlayerNavbar";
import setFavion from "../../setFavion";
import { formatViewerNumbers } from "./../TwitchUtils";
import PlayPauseButton from "./PlayPauseButton";
import ShowStatsButtons from "./ShowStatsButtons";
import ShowSetQualityButtons from "./ShowSetQualityButtons";
import OpenCloseChat from "./OpenCloseChat";
import addSystemNotification from "../live/addSystemNotification";
import NotificationsContext from "../../notifications/NotificationsContext";
import ClipButton from "./ClipButton";
import addGameName from "./addGameName";
import addProfileImg from "./addProfileImg";
import fetchChannelInfo from "./fetchChannelInfo";

export default () => {
  const { p_title, p_game, p_channelInfos } = useLocation().state || {};
  const channelName = useParams().channelName || undefined;
  const videoId = useParams().videoId || undefined;
  const time = useLocation().search.replace("?t=", "").replace("?time=", "");

  const { addNotification } = useContext(NotificationsContext);
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  const [streamInfo, setStreamInfo] = useState(p_channelInfos);
  const [showControlls, setShowControlls] = useState();
  const [showUIControlls, setShowUIControlls] = useState();
  const [hideChat, setHideChat] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState();

  const PlayerUIControlls = useRef();
  const twitchPlayer = useRef();
  const OpenedDate = useRef(Date.now());
  const fadeTimer = useRef();
  const refreshStreamInfoTimer = useRef();
  const videoElementRef = useRef();
  const hideChatDelay = useRef();

  useEffect(() => {
    if (channelName && !videoId && !streamInfo) {
      document.title = `AF | ${channelName} player`;
    } else if (videoId) {
      document.title = `AF | ${channelName || (streamInfo && streamInfo.user_name)} - ${
        p_title || videoId
      }`;
    }
  }, [streamInfo, channelName, p_title, videoId]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    setShrinkNavbar("true");
    setVisible(false);
    setFooterVisible(false);

    twitchPlayer.current = new window.Twitch.Player("twitch-embed", {
      width: "100%",
      height: "100%",
      theme: "dark",
      layout: "video",
      channel: channelName && !videoId ? channelName : null,
      video: videoId || null,
      muted: false,
      time: time.length >= 1 ? time : null,
      allowfullscreen: true,
    });

    return () => {
      document.documentElement.style.overflow = "visible";
      setShrinkNavbar("false");
      setFooterVisible(true);
      setVisible(true);
      clearInterval(refreshStreamInfoTimer.current);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEffect(() => {
    if (videoId && !channelName) {
      const timer = setTimeout(async () => {
        if (twitchPlayer.current) {
          const streamInfo = await fetchStreamInfo(twitchPlayer);
          if (streamInfo.length) setStreamInfo(streamInfo);
        }
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [videoId, channelName, p_title]);

  const addNoti = useCallback(
    ({ type, stream }) => {
      if (stream && type === "Live") {
        addSystemNotification({
          status: "Live",
          stream: stream,
        });

        addNotification([{ ...stream, notiStatus: type }]);
      }
    },
    [addNotification]
  );

  const OnlineEvents = useCallback(async () => {
    console.log("Stream is Online");
    document.title = `AF | ${channelName} Live`;

    const SetStreamInfoAndPushNotis = async () => {
      if (twitchPlayer.current) {
        const LIVEStreamInfo = await fetchStreamInfo(twitchPlayer);
        if (LIVEStreamInfo) {
          const streamWithGame = await addGameName({
            streamInfo,
            newStreamInfo: LIVEStreamInfo,
          });
          const streamWithGameAndProfile = await addProfileImg({
            user_id: LIVEStreamInfo.user_id,
            currentStreamObj: streamWithGame,
          });
          if (streamInfo === null) {
            addNoti({ type: "Live", stream: streamWithGameAndProfile });
          }
          setStreamInfo(streamWithGameAndProfile);
          if (!streamInfo && streamWithGameAndProfile) {
            setFavion(streamWithGameAndProfile.profile_img_url);
          }
        } else {
          const streamWithGameAndProfile = await fetchChannelInfo(
            twitchPlayer.current.getChannelId(),
            true
          );
          if (streamInfo === null) {
            addNoti({ type: "Live", stream: streamWithGameAndProfile });
          }
          setStreamInfo(streamWithGameAndProfile);
          if (!streamInfo && streamWithGameAndProfile) {
            setFavion(streamWithGameAndProfile.profile_img_url);
          }
        }
      }
    };

    try {
      SetStreamInfoAndPushNotis();

      if (!refreshStreamInfoTimer.current) {
        refreshStreamInfoTimer.current = setInterval(async () => {
          SetStreamInfoAndPushNotis();
        }, 1000 * 60 * 2);
      }
    } catch (error) {
      console.log("OnlineEvents -> error", error);
    }

    return () => {
      setFavion();
    };
  }, [streamInfo, channelName, addNoti]);

  const offlineEvents = useCallback(async () => {
    console.log("Stream is Offline");
    setShowUIControlls(false);
    clearInterval(refreshStreamInfoTimer.current);
    setStreamInfo(null);
  }, []);

  const playingEvents = useCallback(() => {
    console.log("playingEvents");
    if (twitchPlayer.current) {
      setShowUIControlls(true);
    }
  }, []);

  useEffect(() => {
    if (twitchPlayer.current) {
      twitchPlayer.current.addEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
      twitchPlayer.current.addEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
      twitchPlayer.current.addEventListener(window.Twitch.Player.PLAYING, playingEvents);
    }

    return () => {
      twitchPlayer.current.removeEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
      twitchPlayer.current.removeEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
      twitchPlayer.current.removeEventListener(window.Twitch.Player.PLAYING, playingEvents);
    };
  }, [OnlineEvents, offlineEvents, playingEvents]);

  const handleMouseOut = useCallback(() => {
    clearTimeout(fadeTimer.current);
    setShowControlls(false);
  }, []);

  function toggleFullScreen(e) {
    const video = videoElementRef.current;
    if (
      (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
    ) {
      if (hideChatDelay.current) clearTimeout(hideChatDelay.current);
      hideChatDelay.current = setTimeout(() => {
        setHideChat(true);
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
      setHideChat(false);
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

  useEffect(() => {
    const showAndResetTimer = throttle(
      () => {
        setShowControlls(true);
        clearTimeout(fadeTimer.current);

        fadeTimer.current = setTimeout(() => {
          setShowControlls(false);
        }, 2000);
      },
      250,
      { leading: true, trailing: false }
    );

    const keyboardEvents = (e) => {
      switch (e.key) {
        case "f":
        case "F":
          toggleFullScreen();
          break;
        default:
          break;
      }
    };

    const refEle = PlayerUIControlls.current;
    if (refEle) {
      refEle.addEventListener("mouseleave", handleMouseOut);
      document.addEventListener("mousemove", showAndResetTimer);
      document.addEventListener("mousedown", showAndResetTimer);
      document.body.addEventListener("keydown", showAndResetTimer);
      document.addEventListener("touchmove", showAndResetTimer);
      refEle.addEventListener("dblclick", toggleFullScreen);
      document.body.addEventListener("keydown", keyboardEvents);

      return () => {
        refEle.removeEventListener("mouseleave", handleMouseOut);
        document.removeEventListener("mousemove", showAndResetTimer);
        document.removeEventListener("mousedown", showAndResetTimer);
        document.body.removeEventListener("keydown", showAndResetTimer);
        document.removeEventListener("touchmove", showAndResetTimer);
        refEle.removeEventListener("dblclick", toggleFullScreen);
        document.body.removeEventListener("keydown", keyboardEvents);
        clearTimeout(fadeTimer.current);
      };
    }
  }, [handleMouseOut]);

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar
          channelName={channelName}
          type={videoId ? "vod" : "live"}
          streamInfo={streamInfo}
          twitchPlayer={twitchPlayer}
          setVisible={setVisible}
          visible={visible}
        />
      </CSSTransition>

      {channelName && !videoId ? (
        <VideoAndChatContainer
          style={{
            height: visible ? "calc(100vh - 85px)" : "100vh",
            top: visible ? "85px" : "0",
          }}
          switchedChatState={switched.toString()}
          hidechat={hideChat.toString()}>
          <div id='twitch-embed' ref={videoElementRef}>
            <CSSTransition
              in={showControlls}
              key={"controllsUI"}
              timeout={1000}
              classNames='fade-controllUI-1s'>
              <VolumeEventOverlay
                show={showUIControlls}
                ref={PlayerUIControlls}
                type='live'
                id='controls'
                hidechat={hideChat.toString()}
                showcursor={showControlls}>
                {streamInfo && (
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
                          }}>
                          {streamInfo.user_name || channelName}
                        </Link>
                        <a
                          className='twitchRedirect'
                          alt=''
                          href={`https://www.twitch.tv/${streamInfo.user_name || channelName}`}>
                          <FaTwitch size={30} color='purple' />
                        </a>

                        <FollowUnfollowBtn
                          channelName={streamInfo.user_name || channelName}
                          id={streamInfo.user_id || twitchPlayer.current.getChannelId()}
                        />
                      </div>
                      <p id='title'>{streamInfo.title || p_title}</p>
                      <Link id='game' to={`/category/${streamInfo.game || p_game}`}>
                        Playing {streamInfo.game_name || p_game}
                      </Link>
                    </>

                    {streamInfo.viewer_count && (
                      <p id='viewers'> Viewers: {formatViewerNumbers(streamInfo.viewer_count)} </p>
                    )}
                    {streamInfo.started_at && (
                      <p id='uptime'>
                        Uptime{" "}
                        <Moment interval={1} durationFromNow>
                          {streamInfo.started_at}
                        </Moment>
                      </p>
                    )}
                  </InfoDisplay>
                )}

                <PlayPauseButton
                  TwitchPlayer={twitchPlayer.current}
                  PlayerUIControlls={PlayerUIControlls.current}
                />
                <VolumeSlider
                  OpenedDate={OpenedDate}
                  PlayerUIControlls={PlayerUIControlls.current}
                  TwitchPlayer={twitchPlayer.current}
                  setShowControlls={setShowControlls}
                />
                <ShowStatsButtons TwitchPlayer={twitchPlayer.current} />
                <ShowSetQualityButtons TwitchPlayer={twitchPlayer.current} />

                {streamInfo && <ClipButton streamInfo={streamInfo} />}

                {!isFullscreen ? (
                  <MdFullscreen
                    size={34}
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={toggleFullScreen}
                    title='Fullsceen (f)'
                  />
                ) : (
                  <MdFullscreenExit
                    size={34}
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      cursor: "pointer",
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
                      switched={switched.toString()}
                      onClick={() => {
                        setSwitched(!switched);
                      }}
                    />

                    <OpenCloseChat
                      hideChat={hideChat}
                      switched={switched}
                      onClick={() => {
                        setHideChat(!hideChat);
                      }}
                    />
                  </>
                )}
              </VolumeEventOverlay>
            </CSSTransition>
            {!showUIControlls && (
              <>
                <ToggleSwitchChatSide
                  title='Switch chat side'
                  id='switchSides'
                  switched={switched.toString()}
                  onClick={() => {
                    setSwitched(!switched);
                  }}
                  style={{
                    right: switched ? "unset" : hideChat ? "10px" : "calc(9vw + 10px)",
                    left: switched ? (hideChat ? "10px" : "calc(9vw + 10px)") : "unset",
                  }}
                />

                <OpenCloseChat
                  hideChat={hideChat}
                  switched={switched}
                  onClick={() => {
                    setHideChat(!hideChat);
                  }}
                  style={{
                    right: switched ? "unset" : hideChat ? "10px" : "calc(9vw + 10px)",
                    left: switched ? (hideChat ? "10px" : "calc(9vw + 10px)") : "unset",
                  }}
                />
              </>
            )}
          </div>
          {!hideChat ? (
            <div id='chat'>
              <ShowNavbarBtn
                variant='dark'
                type='live'
                onClick={() => {
                  setVisible(!visible);
                }}>
                <MdVerticalAlignBottom
                  style={{
                    transform: visible ? "rotateX(180deg)" : "unset",
                    right: "10px",
                  }}
                  size={30}
                  title='Show navbar'
                />
                Nav
              </ShowNavbarBtn>
              <StyledChat
                frameborder='0'
                scrolling='yes'
                theme='dark'
                id={channelName + "-chat"}
                src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout`}
              />
            </div>
          ) : (
            <ShowNavbarBtn
              variant='dark'
              type='video'
              onClick={() => {
                setVisible(!visible);
              }}>
              <MdVerticalAlignBottom
                style={{
                  transform: visible ? "rotateX(180deg)" : "unset",
                  right: "10px",
                }}
                size={30}
                title='Show navbar'
              />
              Nav
            </ShowNavbarBtn>
          )}
        </VideoAndChatContainer>
      ) : videoId ? (
        <VideoAndChatContainer
          id='twitch-embed'
          style={{
            height: visible ? "calc(100vh - 85px)" : "100vh",
            top: visible ? "85px" : "0",
            display: "unset",
          }}>
          <ShowNavbarBtn
            variant='dark'
            type='video'
            onClick={() => {
              setVisible(!visible);
            }}>
            <MdVerticalAlignBottom
              style={{
                transform: visible ? "rotateX(180deg)" : "unset",
                right: "10px",
              }}
              size={30}
              title='Show navbar'
            />
            Nav
          </ShowNavbarBtn>
        </VideoAndChatContainer>
      ) : (
        <p>Error?</p>
      )}
    </>
  );
};
