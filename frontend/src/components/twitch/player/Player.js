import { CSSTransition } from "react-transition-group";
import { useParams, useLocation, Link } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdVerticalAlignBottom } from "react-icons/md";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";

import axios from "axios";
import Moment from "react-moment";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";

import {
  ButtonShowQualities,
  ButtonShowStats,
  InfoDisplay,
  PlaybackStats,
  PlayerNavbar,
  QualitiesList,
  StyledChat,
  ToggleSwitchChatSide,
  VideoAndChatContainer,
  VolumeEventOverlay,
  HideChatButton,
  OpenChatButton,
  CreateClipButton,
} from "./StyledComponents";
import AccountContext from "../../account/AccountContext";
import NavigationContext from "./../../navigation/NavigationContext";
import PlayerEvents from "./PlayerEvents";
import VolumeSlider from "./VolumeSlider";
import Utilities from "./../../../utilities/Utilities";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";

export default () => {
  const { p_uptime, p_viewers, p_title, p_game, p_channelInfos, p_channel } =
    useLocation().state || {};
  const id = useParams().id.split("#")[0] || useParams().id || undefined;
  const location = useLocation();
  const type = location.pathname.split("/")[1];
  const nameFromHash = location.hash !== "" ? location.hash.replace("#", "") : p_channel || null;
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { twitchToken } = useContext(AccountContext);

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

  const volumeEventOverlayRef = useRef();
  const twitchPlayer = useRef();
  const PlayersatsTimer = useRef();
  const channelinfoTimer = useRef();
  const viewersTimer = useRef();
  const uptimeTimer = useRef();
  const OpenedDate = useRef();

  if (type === "live" || type === "player") {
    document.title = `N | ${id} Live`;
  } else if (type === "video" || type === "vod") {
    document.title = `N | ${nameFromHash} - ${p_title || id}`;
  }

  const fetchChannelInfo = useCallback(async () => {
    await axios
      .get(`https://api.twitch.tv/kraken/channels/${twitchPlayer.current.getChannelId()}`, {
        headers: {
          Authorization: `OAuth ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      })
      .then(res => {
        setChannelInfo(res.data);
      })
      .catch(error => {
        console.log("fetchChannelInfo channel: error", error);
      });
  }, [twitchToken]);

  const fetchUptime = useCallback(async () => {
    await axios
      .get(`https://api.twitch.tv/helix/streams`, {
        params: {
          user_id: twitchPlayer.current.getChannelId(),
          first: 1,
        },
        headers: {
          Authorization: `Bearer ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        if (res.data.data[0] && res.data.data[0].started_at) {
          setUptime(res.data.data[0].started_at);
        } else {
          uptimeTimer.current = setInterval(async () => {
            await axios
              .get(`https://api.twitch.tv/helix/streams`, {
                params: {
                  user_id: twitchPlayer.current.getChannelId(),
                  first: 1,
                },
                headers: {
                  Authorization: `Bearer ${twitchToken}`,
                  "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
              })
              .then(res => {
                if (res.data.data[0] && res.data.data[0].started_at) {
                  setUptime(res.data.data[0].started_at);
                  clearInterval(uptimeTimer.current);
                }
              });
          }, 1000 * 60 * 0.5);
        }
      })
      .catch(error => {
        console.log("fetchChannelInfo stream: error", error);
      });
  }, [twitchToken]);

  const PausePlay = () => {
    if (twitchPlayer.current.isPaused()) {
      twitchPlayer.current.play();
      setIsPaused(false);
    } else {
      twitchPlayer.current.pause();
      setIsPaused(true);
    }
  };

  const setOpenedTime = () => {
    if (!OpenedDate.current) {
      OpenedDate.current = new Date().getTime();
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

  const toggleFullscreen2 = TwitchPlayer => {
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
    window.addEventListener("focus", setOpenedTime);

    return () => {
      window.removeEventListener("focus", setOpenedTime);
    };
  }, []);

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
      channel: id && (type === "live" || type === "player") ? id : null,
      video: id && (type === "video" || type === "vod") ? id : null,
      muted: false,
    });

    return () => {
      document.documentElement.style.overflow = "visible";
      setShrinkNavbar("false");
      setFooterVisible(true);
      setVisible(true);
      clearInterval(PlayersatsTimer.current);
      clearInterval(channelinfoTimer.current);
      clearInterval(viewersTimer.current);
      clearInterval(uptimeTimer.current);
    };
  }, [
    setShrinkNavbar,
    setFooterVisible,
    setVisible,
    id,
    fetchChannelInfo,
    type,
    twitchToken,
    fetchUptime,
  ]);

  useEffect(() => {
    if ((type === "video" || type === "vod") && (!nameFromHash || !p_title)) {
      const videoInfoTimer = setTimeout(async () => {
        await axios
          .get(`https://api.twitch.tv/kraken/videos/${id}`, {
            headers: {
              Authorization: `Bearer ${twitchToken}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
              Accept: "application/vnd.twitchtv.v5+json",
            },
          })
          .then(res => {
            document.title = `N | ${res.data.channel.display_name} - ${res.data.title}`;
          });
      }, 5000);
      return () => {
        clearTimeout(videoInfoTimer);
      };
    }
  }, [id, nameFromHash, p_title, type, twitchToken]);

  const OnlineEvents = useCallback(() => {
    console.log("Stream is Online");
    setTimeout(() => {
      if (!channelInfo) fetchChannelInfo();
      if (!uptime) fetchUptime();
      setViewers(twitchPlayer.current.getViewers());
    }, 5000);

    if (!viewersTimer.current) {
      viewersTimer.current = setInterval(() => {
        setViewers(twitchPlayer.current.getViewers());
      }, 1000 * 60 * 1);
    }

    if (!channelinfoTimer.current) {
      channelinfoTimer.current = setInterval(() => {
        fetchChannelInfo();
      }, 1000 * 60 * 5);
    }
  }, [fetchUptime, fetchChannelInfo, channelInfo, uptime]);

  const offlineEvents = useCallback(() => {
    console.log("Stream is Offline");

    clearInterval(viewersTimer.current);
    clearInterval(channelinfoTimer.current);
    setUptime(null);
    clearInterval(uptimeTimer.current);

    if (!channelinfoTimer.current && (type === "live" || type === "player")) {
      fetchChannelInfo();
      channelinfoTimer.current = setInterval(() => {
        fetchChannelInfo();
      }, 1000 * 60 * 15);
    }
  }, [fetchChannelInfo, type]);

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

  const CreateAndOpenClip = async () => {
    const Width = window.screen.width * 0.6;
    const Height = window.screen.height * 0.8;
    const LeftPosition = (window.screen.width - Width) / 2;
    const TopPosition = (window.screen.height - Height) / 2;
    const settings = `height=${Height},width=${Width},top=${TopPosition},left=${LeftPosition},scrollbars=yes,resizable`;

    await axios
      .post(
        `https://api.twitch.tv/helix/clips?broadcaster_id=${channelInfo._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        }
      )
      .then(res => {
        console.log("res", res);
        window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  if (type === "live" || type === "player") {
    return (
      <>
        <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
          <PlayerNavbar>
            <Link
              to={{
                pathname: `/channel/${id}`,
                state: {
                  p_channelInfos: channelInfo,
                  p_viewers: viewers,
                  p_uptime: uptime,
                  p_id: twitchPlayer.current ? twitchPlayer.current.getChannelId() : null,
                },
              }}>
              <MdAccountCircle size={20} />
              {id}'s channel page
            </Link>
          </PlayerNavbar>
        </CSSTransition>

        <VideoAndChatContainer
          style={{
            height: visible ? "calc(100vh - 75px)" : "100vh",
            top: visible ? "75px" : "0",
          }}
          switchedChatState={switched.toString()}
          hidechat={hideChat.toString()}>
          <div id='twitch-embed'>
            <VolumeEventOverlay
              ref={volumeEventOverlayRef}
              type='live'
              id='controls'
              hidechat={hideChat.toString()}>
              <InfoDisplay>
                <>
                  {channelInfo ? <img src={channelInfo.logo} alt='' /> : null}
                  <div id='name'>
                    <a href={channelInfo ? channelInfo.url : `https://www.twitch.tv/${id}`}>
                      {channelInfo ? channelInfo.display_name : id}
                    </a>
                    {channelInfo ? (
                      <FollowUnfollowBtn
                        channelName={channelInfo ? channelInfo.display_name : id}
                        id={channelInfo._id}
                      />
                    ) : null}
                  </div>
                  <p id='title'>{channelInfo ? channelInfo.status : p_title}</p>
                  <Link id='game' to={`/game/${channelInfo ? channelInfo.game : p_game}`}>
                    Playing {channelInfo ? channelInfo.game : p_game}
                  </Link>
                </>

                {viewers ? (
                  <p id='viewers'> Viewers: {Utilities.formatViewerNumbers(viewers)} </p>
                ) : null}
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
              {showPlaybackStats && playbackStats ? (
                <PlaybackStats>
                  {Object.keys(playbackStats).map(statName => {
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
              ) : null}
              <ButtonShowStats
                title='Show video stats'
                onClick={() => {
                  if (!showPlaybackStats) {
                    document.querySelector("#controls").style.opacity = 1;
                  } else {
                    document.querySelector("#controls").style.opacity = 0;
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
              {showQualities && qualities ? (
                <QualitiesList>
                  {qualities.map(quality => {
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
              ) : null}
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
                  : twitchPlayer.current
                  ? twitchPlayer.current.getQuality().name
                  : null}
              </ButtonShowQualities>
              {channelInfo ? (
                <CreateClipButton title='Create clip' onClick={CreateAndOpenClip} />
              ) : null}

              {true ? (
                <MdFullscreen
                  size={30}
                  style={{ position: "absolute", right: "12px", bottom: "12px", cursor: "pointer" }}
                  onClick={() => {
                    toggleFullscreen2(twitchPlayer.current);
                  }}
                />
              ) : (
                <MdFullscreenExit
                  size={30}
                  style={{ position: "absolute", right: "12px", bottom: "12px", cursor: "pointer" }}
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
                  onClick={() => {
                    setHideChat(!hideChat);
                  }}
                />
              ) : (
                <HideChatButton
                  title='Hide chat'
                  hidechat={hideChat.toString()}
                  onClick={() => {
                    setHideChat(!hideChat);
                  }}
                />
              )}
            </VolumeEventOverlay>
            {twitchPlayer.current ? (
              <PlayerEvents
                volumeEventOverlayRef={volumeEventOverlayRef}
                setVolumeText={setVolumeText}
                setVolumeMuted={setVolumeMuted}
                TwitchPlayer={twitchPlayer.current}
                setIsPaused={setIsPaused}
                type='live'
                OpenedDate={OpenedDate}
              />
            ) : null}
          </div>
          {!hideChat ? (
            <div id='chat'>
              <MdVerticalAlignBottom
                style={{
                  transform: visible ? "rotateX(180deg)" : "unset",
                }}
                size={45}
                id='ToggleNavbarButton'
                title='Show navbar'
                onClick={() => {
                  setVisible(!visible);
                }}
              />
              <StyledChat
                frameborder='0'
                scrolling='yes'
                theme='dark'
                id={id + "-chat"}
                src={`https://www.twitch.tv/embed/${id}/chat?darkpopout`}
              />
            </div>
          ) : null}
        </VideoAndChatContainer>
      </>
    );
  } else if (type === "video" || type === "vod") {
    return (
      <>
        <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
          <PlayerNavbar>
            {nameFromHash ? (
              <Link to={`/channel/${nameFromHash}`}>
                <div id='icon'>
                  <MdAccountCircle size={20} />
                </div>
                {nameFromHash}'s channel page
              </Link>
            ) : null}
          </PlayerNavbar>
        </CSSTransition>

        <VideoAndChatContainer
          id='twitch-embed'
          style={{
            height: visible ? "calc(100vh - 75px)" : "100vh",
            top: visible ? "75px" : "0",
            display: "unset",
          }}>
          <MdVerticalAlignBottom
            style={{
              transform: visible ? "rotateX(180deg)" : "unset",
              right: "10px",
            }}
            size={45}
            id='ToggleNavbarButton'
            title='Show navbar'
            onClick={() => {
              setVisible(!visible);
            }}
          />
        </VideoAndChatContainer>
      </>
    );
  } else {
    return <p>Error?</p>;
  }
};
