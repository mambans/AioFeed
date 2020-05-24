import { CSSTransition } from "react-transition-group";
import { throttle } from "lodash";
import { useParams, useLocation, Link } from "react-router-dom";
import Moment from "react-moment";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";

import { MdVerticalAlignBottom } from "react-icons/md";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";

import fetchAndSetChannelInfo from "./fetchAndSetChannelInfo";
import fetchUptime from "./fetchUptime";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import NavigationContext from "./../../navigation/NavigationContext";
import PlayerEvents from "./PlayerEvents";
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

export default () => {
  const { p_uptime, p_viewers, p_title, p_game, p_channelInfos } = useLocation().state || {};
  const channelName = useParams().channelName || undefined;
  const videoId = useParams().videoId || undefined;
  const time = useLocation().search.replace("?t=", "").replace("?time=", "");

  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const [switched, setSwitched] = useState(false);
  const { addNotification } = useContext(NotificationsContext);

  const [channelInfo, setChannelInfo] = useState(p_channelInfos);
  const [uptime, setUptime] = useState(p_uptime);
  const [viewers, setViewers] = useState(p_viewers);
  const [hideChat, setHideChat] = useState(false);
  const [showControlls, setShowControlls] = useState();
  const [latestVod, setLatestVod] = useState();
  const [showUIControlls, setShowUIControlls] = useState();

  const volumeEventOverlayRef = useRef();
  const twitchPlayer = useRef();
  const channelinfoTimer = useRef();
  const viewersTimer = useRef();
  const uptimeTimer = useRef();
  const OpenedDate = useRef(Date.now());
  const fadeTimer = useRef();

  const toggleFullscreen2 = (TwitchPlayer) => {
    const isFullScreen = TwitchPlayer.getFullscreen();
    TwitchPlayer.setFullscreen(!isFullScreen);
    TwitchPlayer.showPlayerControls(!isFullScreen);

    // if (TwitchPlayer.getFullscreen()) {
    //   document.exitFullscreen();
    // } else
    if (TwitchPlayer._bridge._iframe.requestFullScreen) {
      TwitchPlayer._bridge._iframe.requestFullScreen();
    } else if (TwitchPlayer._bridge._iframe.mozRequestFullScreen) {
      TwitchPlayer._bridge._iframe.mozRequestFullScreen();
    } else if (TwitchPlayer._bridge._iframe.webkitRequestFullScreen) {
      TwitchPlayer._bridge._iframe.webkitRequestFullScreen();
    }
  };

  useEffect(() => {
    if (channelName && !videoId && !channelInfo) {
      document.title = `AF | ${channelName} player`;
    } else if (videoId) {
      document.title = `AF | ${channelName || (channelInfo && channelInfo.display_name)} - ${
        p_title || videoId
      }`;
    }
    if (channelInfo) {
      setFavion(channelInfo.logo);
    }

    return () => {
      setFavion();
    };
  }, [channelInfo, channelName, p_title, videoId]);

  useEffect(() => {
    const uptTimer = uptimeTimer.current;
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
      clearInterval(channelinfoTimer.current);
      clearInterval(viewersTimer.current);
      clearInterval(uptTimer);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEffect(() => {
    if (videoId && !channelName) {
      const timer = setTimeout(async () => {
        if (twitchPlayer.current)
          await fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [videoId, channelName, p_title]);

  const addNoti = useCallback(
    ({ type }) => {
      if (channelInfo && type === "Live") {
        addSystemNotification({
          status: "online",
          stream: channelInfo,
        });

        addNotification([{ ...channelInfo, notiStatus: type }]);
      }
    },
    [channelInfo, addNotification]
  );

  const OnlineEvents = useCallback(() => {
    console.log("Stream is Online");
    document.title = `AF | ${channelName} Live`;
    twitchPlayer.current.showPlayerControls(false);

    addNoti({ type: "Live" });

    setTimeout(() => {
      if (!channelInfo) {
        fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
      }
      if (!uptime) fetchUptime(twitchPlayer, setUptime, uptimeTimer);
      setViewers(twitchPlayer.current.getViewers());
    }, 5000);

    if (!viewersTimer.current) {
      viewersTimer.current = setInterval(() => {
        setViewers(twitchPlayer.current.getViewers());
      }, 1000 * 60 * 1);
    }

    if (!channelinfoTimer.current) {
      channelinfoTimer.current = setInterval(() => {
        fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
      }, 1000 * 60 * 5);
    }
  }, [channelInfo, uptime, channelName, addNoti]);

  const offlineEvents = useCallback(() => {
    console.log("Stream is Offline");
    twitchPlayer.current.showPlayerControls(true);
    setShowUIControlls(false);

    clearInterval(viewersTimer.current);
    clearInterval(channelinfoTimer.current);
    setUptime(null);
    clearInterval(uptimeTimer.current);

    if (!channelinfoTimer.current && channelName && !videoId) {
      fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
      channelinfoTimer.current = setInterval(() => {
        fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
      }, 1000 * 60 * 15);
    }
  }, [channelName, videoId]);

  useEffect(() => {
    if (twitchPlayer.current) {
      twitchPlayer.current.addEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
      twitchPlayer.current.addEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
    }

    return () => {
      twitchPlayer.current.removeEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
      twitchPlayer.current.removeEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
    };
  }, [OnlineEvents, offlineEvents]);

  // const handleMouseOver = useCallback(() => {
  //   setShowControlls(true);
  // }, []);

  const handleMouseOut = useCallback(() => {
    clearTimeout(fadeTimer.current);
    setShowControlls(false);
  }, []);

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

    const refEle = volumeEventOverlayRef.current;
    // refEle.addEventListener("mouseenter", handleMouseOver);
    if (refEle) {
      refEle.addEventListener("mouseleave", handleMouseOut);
      document.addEventListener("mousemove", showAndResetTimer);
      document.addEventListener("mousedown", showAndResetTimer);
      document.body.addEventListener("keydown", showAndResetTimer);
      document.addEventListener("touchmove", showAndResetTimer);

      return () => {
        // refEle.removeEventListener("mouseenter", handleMouseOver);

        refEle.removeEventListener("mouseleave", handleMouseOut);
        document.removeEventListener("mousemove", showAndResetTimer);
        document.removeEventListener("mousedown", showAndResetTimer);
        document.body.removeEventListener("keydown", showAndResetTimer);
        document.removeEventListener("touchmove", showAndResetTimer);
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
          channelInfo={channelInfo}
          viewers={viewers}
          uptime={uptime}
          twitchPlayer={twitchPlayer}
          setVisible={setVisible}
          visible={visible}
          setLatestVod={setLatestVod}
          latestVod={latestVod}
          showUIControlls={showUIControlls}
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
          <div id='twitch-embed'>
            <CSSTransition
              in={showControlls}
              // in={true}
              key={"controllsUI"}
              timeout={1000}
              classNames='fade-controllUI-1s'>
              <VolumeEventOverlay
                show={showUIControlls}
                ref={volumeEventOverlayRef}
                type='live'
                id='controls'
                hidechat={hideChat.toString()}
                showcursor={showControlls}>
                <InfoDisplay>
                  <>
                    {channelInfo && <img src={channelInfo.logo} alt='' />}
                    <div id='name'>
                      <Link
                        to={{
                          pathname: `channel`,
                          state: {
                            p_id: channelInfo && channelInfo._id,
                          },
                        }}>
                        {channelInfo ? channelInfo.display_name : channelName}
                      </Link>
                      <a
                        className='twitchRedirect'
                        alt=''
                        href={
                          channelInfo ? channelInfo.url : `https://www.twitch.tv/${channelName}`
                        }>
                        <FaTwitch size={30} color='purple' />
                      </a>
                      {channelInfo && (
                        <FollowUnfollowBtn
                          channelName={channelInfo ? channelInfo.display_name : channelName}
                          id={channelInfo._id}
                        />
                      )}
                    </div>
                    <p id='title'>{channelInfo ? channelInfo.status : p_title}</p>
                    <Link id='game' to={`/category/${channelInfo ? channelInfo.game : p_game}`}>
                      Playing {channelInfo ? channelInfo.game : p_game}
                    </Link>
                  </>

                  {viewers && <p id='viewers'> Viewers: {formatViewerNumbers(viewers)} </p>}
                  {uptime ? (
                    <p id='uptime'>
                      Uptime <Moment durationFromNow>{uptime}</Moment>
                    </p>
                  ) : (
                    <p id='uptime'>Offline</p>
                  )}
                </InfoDisplay>

                <PlayPauseButton
                  TwitchPlayer={twitchPlayer.current}
                  volumeEventOverlayRef={volumeEventOverlayRef.current}
                />
                <VolumeSlider
                  OpenedDate={OpenedDate}
                  volumeEventOverlayRef={volumeEventOverlayRef.current}
                  TwitchPlayer={twitchPlayer.current}
                  setShowControlls={setShowControlls}
                />
                <ShowStatsButtons TwitchPlayer={twitchPlayer.current} />
                <ShowSetQualityButtons TwitchPlayer={twitchPlayer.current} />

                {channelInfo && <ClipButton channelInfo={channelInfo} />}

                {true ? (
                  <MdFullscreen
                    size={30}
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      toggleFullscreen2(twitchPlayer.current);
                    }}
                  />
                ) : (
                  <MdFullscreenExit
                    size={30}
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      toggleFullscreen2(twitchPlayer.current);
                    }}
                  />
                )}

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
              </VolumeEventOverlay>
            </CSSTransition>
            {twitchPlayer.current && (
              <PlayerEvents
                TwitchPlayer={twitchPlayer.current}
                type='live'
                setShowUIControlls={setShowUIControlls}
              />
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
