import { CSSTransition } from "react-transition-group";
import { useParams, useLocation, Link } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdVerticalAlignBottom } from "react-icons/md";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { FaTwitch } from "react-icons/fa";

import axios from "axios";
import Moment from "react-moment";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { throttle } from "lodash";

import reauthenticate from "./../reauthenticate";
import AccountContext from "../../account/AccountContext";
import fetchAndSetChannelInfo from "./fetchAndSetChannelInfo";
import fetchUptime from "./fetchUptime";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import NavigationContext from "./../../navigation/NavigationContext";
import PlayerEvents from "./PlayerEvents";
import { getCookie } from "./../../../util/Utils";
import VolumeSlider from "./VolumeSlider";
import {
  ButtonShowQualities,
  ButtonShowStats,
  InfoDisplay,
  PlaybackStats,
  QualitiesList,
  StyledChat,
  ToggleSwitchChatSide,
  VideoAndChatContainer,
  VolumeEventOverlay,
  HideChatButton,
  OpenChatButton,
  CreateClipButton,
  ShowNavbarBtn,
} from "./StyledComponents";
import PlayerNavbar from "./PlayerNavbar";
import setFavion from "../../setFavion";
import { formatViewerNumbers } from "./../TwitchUtils";
import validateToken from "../validateToken";

export default () => {
  const { p_uptime, p_viewers, p_title, p_game, p_channelInfos } = useLocation().state || {};
  const channelName = useParams().channelName || undefined;
  const videoId = useParams().videoId || undefined;
  const time = useLocation().search.replace("?t=", "").replace("?time=", "");

  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { setTwitchToken, setRefreshToken } = useContext(AccountContext);

  const [switched, setSwitched] = useState(false);
  const [volumeText, setVolumeText] = useState(0);
  const [volumeMuted, setVolumeMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [channelInfo, setChannelInfo] = useState(p_channelInfos);
  const [uptime, setUptime] = useState(p_uptime);
  const [viewers, setViewers] = useState(p_viewers);
  const [showPlaybackStats, setShowPlaybackStats] = useState();
  const [playbackStats, setPlaybackStats] = useState();
  const [showQualities, setShowQualities] = useState();
  const [qualities, setQualities] = useState();
  const [activeQuality, setActiveQuality] = useState();
  const [hideChat, setHideChat] = useState(false);
  const [showControlls, setShowControlls] = useState();
  const [latestVod, setLatestVod] = useState();
  const [showUIControlls, setShowUIControlls] = useState();

  const volumeEventOverlayRef = useRef();
  const twitchPlayer = useRef();
  const PlayersatsTimer = useRef();
  const channelinfoTimer = useRef();
  const viewersTimer = useRef();
  const uptimeTimer = useRef();
  const OpenedDate = useRef(new Date().getTime());
  const fadeTimer = useRef();

  const PausePlay = () => {
    if (twitchPlayer.current.isPaused()) {
      twitchPlayer.current.play();
      setIsPaused(false);
    } else {
      twitchPlayer.current.pause();
      setIsPaused(true);
    }
  };

  const latencyColorValue = (name, value) => {
    if (name === "hlsLatencyBroadcaster" || name === "hlsLatencyEncoder") {
      if (value >= 10) {
        return "#f00";
      } else if (value >= 5) {
        return "#f66329";
      } else if (value >= 2.5) {
        return "#f6b029";
      } else {
        return "#4cf629";
      }
    } else {
      return "unset";
    }
  };

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
      clearInterval(PlayersatsTimer.current);
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

  const OnlineEvents = useCallback(() => {
    console.log("Stream is Online");
    document.title = `AF | ${channelName} Live`;
    twitchPlayer.current.showPlayerControls(false);

    setTimeout(() => {
      if (!channelInfo) fetchAndSetChannelInfo(twitchPlayer.current.getChannelId(), setChannelInfo);
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
  }, [channelInfo, uptime, channelName]);

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

  const axiosConfig = (method, access_token = getCookie("Twitch-access_token")) => {
    return {
      method: method,
      url: `https://api.twitch.tv/helix/clips?broadcaster_id=${channelInfo._id}`,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    };
  };

  const CreateAndOpenClip = async () => {
    const Width = window.screen.width * 0.6;
    const Height = 920;
    const LeftPosition = (window.screen.width - Width) / 2;
    const TopPosition = (window.screen.height - Height) / 2;
    const settings = `height=${Height},width=${Width},top=${TopPosition},left=${LeftPosition},scrollbars,resizable,status,location,toolbar,`;
    await validateToken().then(async () => {
      await axios(axiosConfig("post"))
        .then((res) => {
          window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings);
        })
        .catch(() => {
          reauthenticate(setTwitchToken, setRefreshToken).then(async (access_token) => {
            await axios(axiosConfig("post", access_token)).then((res) => {
              window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings);
            });
          });
        });
    });
  };

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
                {isPaused ? (
                  <FaPlay id='PausePlay' size={30} onClick={PausePlay} />
                ) : (
                  <FaPause id='PausePlay' size={30} onClick={PausePlay} />
                )}
                <VolumeSlider
                  volume={volumeText}
                  setVolumeText={setVolumeText}
                  TwitchPlayer={twitchPlayer.current}
                  volumeMuted={volumeMuted}
                  setVolumeMuted={setVolumeMuted}
                  // onChange={Function}
                  // onChangeComplete={Function}
                />
                {showPlaybackStats && playbackStats && (
                  <PlaybackStats>
                    {Object.keys(playbackStats).map((statName) => {
                      return (
                        <div key={statName}>
                          <span>{`${statName}: `}</span>
                          <span
                            style={{
                              color: latencyColorValue(statName, playbackStats[statName]),
                            }}>
                            {playbackStats[statName]}
                          </span>
                        </div>
                      );
                    })}
                  </PlaybackStats>
                )}
                <ButtonShowStats
                  title='Show video stats'
                  onClick={() => {
                    if (!showPlaybackStats) {
                      document.querySelector("#controls").style.opacity = 1;
                    } else {
                      document.querySelector("#controls").style.removeProperty("opacity");
                    }
                    setShowPlaybackStats(!showPlaybackStats);
                    setPlaybackStats(twitchPlayer.current.getPlaybackStats());

                    if (PlayersatsTimer.current) {
                      clearInterval(PlayersatsTimer.current);
                    } else {
                      PlayersatsTimer.current = setInterval(() => {
                        setPlaybackStats(twitchPlayer.current.getPlaybackStats());
                      }, 1500);
                    }
                  }}
                />

                {channelInfo && (
                  <CreateClipButton title='Create clip' onClick={CreateAndOpenClip} />
                )}

                {showQualities && qualities && (
                  <QualitiesList>
                    {qualities.map((quality) => {
                      return (
                        <li
                          key={quality.name}
                          onClick={() => {
                            twitchPlayer.current.setQuality(quality.group);
                            setActiveQuality(quality);
                            setShowQualities(false);
                          }}>
                          {quality.name}
                        </li>
                      );
                    })}
                  </QualitiesList>
                )}
                <ButtonShowQualities
                  id='showQualities'
                  title='Show qualities'
                  onClick={() => {
                    setShowQualities(!showQualities);
                    setQualities(twitchPlayer.current.getQualities());
                  }}>
                  {/* <Icon icon={ic_settings} size={26}></Icon> */}
                  <MdSettings size={24} />
                  {activeQuality
                    ? activeQuality.name
                    : twitchPlayer.current && twitchPlayer.current.getQuality().name}
                </ButtonShowQualities>

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
                {hideChat ? (
                  <OpenChatButton
                    title='Open chat'
                    hidechat={hideChat.toString()}
                    switched={switched.toString()}
                    onClick={() => {
                      setHideChat(!hideChat);
                    }}
                  />
                ) : (
                  <HideChatButton
                    title='Hide chat'
                    hidechat={hideChat.toString()}
                    switched={switched.toString()}
                    onClick={() => {
                      setHideChat(!hideChat);
                    }}
                  />
                )}
              </VolumeEventOverlay>
            </CSSTransition>
            {twitchPlayer.current && (
              <PlayerEvents
                volumeEventOverlayRef={volumeEventOverlayRef}
                setVolumeText={setVolumeText}
                setVolumeMuted={setVolumeMuted}
                TwitchPlayer={twitchPlayer.current}
                setIsPaused={setIsPaused}
                type='live'
                OpenedDate={OpenedDate}
                setActiveQuality={setActiveQuality}
                setShowUIControlls={setShowUIControlls}
              />
            )}
          </div>
          {!hideChat && (
            <div id='chat'>
              <ShowNavbarBtn
                variant='dark'
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
