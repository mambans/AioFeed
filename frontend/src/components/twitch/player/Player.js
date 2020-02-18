import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";
import { ic_account_circle } from "react-icons-kit/md/ic_account_circle";
import Icon from "react-icons-kit";
import { CSSTransition } from "react-transition-group";
// import { volumeLow } from "react-icons-kit/icomoon/volumeLow";
// import { volumeMedium } from "react-icons-kit/icomoon/volumeMedium";
// import { volumeHigh } from "react-icons-kit/icomoon/volumeHigh";
// import { volumeMute } from "react-icons-kit/icomoon/volumeMute";
import { volumeMute2 } from "react-icons-kit/icomoon/volumeMute2";

import {
  VideoAndChatContainer,
  StyledChat,
  ToggleNavbarButton,
  ToggleSwitchChatSide,
  PlayerNavbar,
  VolumeEventOverlay,
  VolumeElement,
} from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

const TwitchInteractivePlayer = ({
  channel,
  video,
  volumeEventOverlayRef,
  setVolumeText,
  setVolumeMuted,
}) => {
  useEffect(() => {
    let TwitchPlayer = new window.Twitch.Player("twitch-embed", {
      width: "100%",
      height: "100%",
      theme: "dark",
      layout: "video",
      channel: channel || null,
      video: video || null,
      muted: false,
    });

    const volumeEventOverlayRefElement = volumeEventOverlayRef.current;

    const scrollChangeVolumeEvent = e => {
      if ((e.wheelDelta && e.wheelDelta > 0) || e.deltaY < 0) {
        const newVolume = TwitchPlayer.getVolume() + 0.01;
        if (newVolume < 1) {
          TwitchPlayer.setVolume(newVolume);
          setVolumeText(newVolume * 100);
        } else {
          TwitchPlayer.setVolume(1);
          setVolumeText(100);
        }
      } else {
        const newVolume = TwitchPlayer.getVolume() - 0.01;
        if (newVolume > 0) {
          TwitchPlayer.setVolume(newVolume);
          setVolumeText(newVolume * 100);
        } else {
          TwitchPlayer.setVolume(0);
          setVolumeText(0);
        }
      }
    };

    const clickUnmuteMuteOrPlay = e => {
      if (e.button === 1) {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      } else if (e.button === 0 && TwitchPlayer.isPaused()) {
        TwitchPlayer.play();
      } else if (e.button === 0 && TwitchPlayer.getMuted()) {
        TwitchPlayer.setMuted(false);
        setVolumeMuted(false);
      }
    };

    const keyboardEvents = e => {
      if (e.key === "Space") {
        if (TwitchPlayer.isPaused()) {
          TwitchPlayer.play();
        } else {
          TwitchPlayer.pause();
        }
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "m") {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      }
    };

    const toggleFullscreen = () => {
      const el = document.getElementsByTagName("iframe")[0];
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (el.requestFullScreen) {
          el.requestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        }
      }
    };

    const twitchPlayerEventListeners = () => {
      setVolumeMuted(TwitchPlayer.getMuted());

      volumeEventOverlayRefElement.addEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.addEventListener("mouseup", clickUnmuteMuteOrPlay);
      document.body.addEventListener("keyup", keyboardEvents);
      document.body.addEventListener("dblclick", toggleFullscreen);
    };

    TwitchPlayer.addEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);

    return () => {
      TwitchPlayer.removeEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);
      volumeEventOverlayRefElement.removeEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.removeEventListener("mouseup", clickUnmuteMuteOrPlay);
      document.body.removeEventListener("keyup", keyboardEvents);
      document.body.removeEventListener("dblclick", toggleFullscreen);
    };
  }, [channel, video, volumeEventOverlayRef, setVolumeMuted, setVolumeText]);

  return null;
};

const NonInteractiveVolumeSlider = ({ volumeMuted, volumeText }) => {
  // const volumeIcon = () => {
  //   if (volumeMuted) {
  //     return volumeMute2;
  //   } else if (volumeText <= 33) {
  //     return volumeLow;
  //   } else if (volumeText <= 66) {
  //     return volumeMedium;
  //   } else if (volumeText <= 100) {
  //     return volumeHigh;
  //   } else {
  //     return volumeMute;
  //   }
  // };

  return (
    <VolumeElement id='VolumeElement'>
      {volumeMuted ? (
        <Icon size={33.6} icon={volumeMute2} style={{ color: "red" }} />
      ) : (
        <h3> {volumeText && volumeText.toFixed(0)}</h3>
      )}
      <div className='vlCtrl'>
        {/* <Icon size={30} icon={volumeIcon()} style={volumeMuted ? { color: "red" } : null} /> */}
        <svg viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'>
          <line
            id='ctrlLineB'
            className='volElem'
            stroke={volumeMuted ? "#c30000" : "#B28A24"}
            x1='0'
            y1='5'
            x2='100'
            y2='5'
            opacity='0.6'
          />
          <line
            id='ctrlLineF'
            className='volElem'
            stroke={volumeMuted ? "#c30000" : "#F4AF0A"}
            x1='0'
            y1='5'
            x2={volumeText && volumeText.toFixed(0)}
            y2='5'
          />

          {/* <circle
            id='ctrlCirce'
            cx={volumeText + 10 && (volumeText + 10).toFixed(0)}
            cy='13.5'
            r='13'
            fill='#F4AF0A'
          /> */}

          {/* <text
          x={volumeText + 10 && (volumeText + 10).toFixed(0)}
          y='50%'
          textAnchor='middle'
          stroke='#ffffff'
          strokeWidth='2px'
          dy='.3em'>
          {volumeText && volumeText.toFixed(0)}
        </text> */}
        </svg>
      </div>
    </VolumeElement>
  );
};

export default () => {
  const { id } = useParams();
  document.title = ` ${id} | Notifies`;
  const location = useLocation();
  const type = location.pathname.split("/")[2];
  const nameFromHash = location.hash !== "" ? location.hash.replace("#", "") : null;
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const [switched, setSwitched] = useState(false);
  const [volumeText, setVolumeText] = useState(0);
  const [volumeMuted, setVolumeMuted] = useState(true);
  const volumeEventOverlayRef = useRef();

  useEffect(() => {
    setShrinkNavbar("true");
    setVisible(false);
    setFooterVisible(false);

    return () => {
      setShrinkNavbar("false");
      setFooterVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible]);

  if (type === "live") {
    return (
      <>
        <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
          <PlayerNavbar>
            <Link to={`/twitch/channel/${id}`}>
              <Icon icon={ic_account_circle} size={20}></Icon>
              {id}'s channel page
            </Link>
          </PlayerNavbar>
        </CSSTransition>

        <VideoAndChatContainer
          style={{
            height: visible ? "calc(100vh - 75px)" : "100vh",
            top: visible ? "75px" : "0",
          }}
          switchedChatState={switched.toString()}>
          <div id='twitch-embed'>
            <VolumeEventOverlay ref={volumeEventOverlayRef} type='live'>
              <NonInteractiveVolumeSlider
                volumeMuted={volumeMuted}
                volumeText={volumeText}
                type='live'
              />
            </VolumeEventOverlay>
            <TwitchInteractivePlayer
              channel={id}
              volumeEventOverlayRef={volumeEventOverlayRef}
              setVolumeText={setVolumeText}
              setVolumeMuted={setVolumeMuted}
            />
            <ToggleSwitchChatSide
              id='switchSides'
              switched={switched.toString()}
              onClick={() => {
                setSwitched(!switched);
              }}
            />
          </div>
          <div id='chat'>
            <ToggleNavbarButton
              icon={visible ? ic_vertical_align_top : ic_vertical_align_bottom}
              title={visible ? "Hide navbar" : "Show navbar"}
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
        </VideoAndChatContainer>
      </>
    );
  } else if (type === "video") {
    return (
      <>
        <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
          <PlayerNavbar>
            {nameFromHash ? (
              <Link to={`/twitch/channel/${nameFromHash}`}>
                <div id='icon'>
                  <Icon icon={ic_account_circle} size={20} />
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
          <VolumeEventOverlay ref={volumeEventOverlayRef} type='video'>
            <NonInteractiveVolumeSlider
              volumeMuted={volumeMuted}
              volumeText={volumeText}
              type='video'
            />
          </VolumeEventOverlay>
          <ToggleNavbarButton
            icon={visible ? ic_vertical_align_top : ic_vertical_align_bottom}
            title={visible ? "Hide navbar" : "Show navbar"}
            style={{ right: "10px" }}
            onClick={() => {
              setVisible(!visible);
            }}
          />
          <TwitchInteractivePlayer
            video={id}
            volumeEventOverlayRef={volumeEventOverlayRef}
            setVolumeText={setVolumeText}
            setVolumeMuted={setVolumeMuted}
          />
        </VideoAndChatContainer>
      </>
    );
  }
};
