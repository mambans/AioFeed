import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useLocation, NavLink } from "react-router-dom";
import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";
import { Nav } from "react-bootstrap";
import { ic_account_circle } from "react-icons-kit/md/ic_account_circle";
import Icon from "react-icons-kit";
import { CSSTransition } from "react-transition-group";
import { volumeLow } from "react-icons-kit/icomoon/volumeLow";
import { volumeMedium } from "react-icons-kit/icomoon/volumeMedium";
import { volumeHigh } from "react-icons-kit/icomoon/volumeHigh";
import { volumeMute2 } from "react-icons-kit/icomoon/volumeMute2";
import { volumeMute } from "react-icons-kit/icomoon/volumeMute";

import {
  VideoAndChatContainer,
  StyledChat,
  ToggleNavbarButton,
  ToggleSwitchChatSide,
  PlayerNavbar,
  VolumeEventOverlay,
} from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

const TwitchInteractivePlayer = ({
  channel,
  video,
  volumeEventOverlayRef,
  setVolumeText,
  setVolumeMuted,
  type,
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

    const scrollClickMuteVolume = e => {
      if (typeof e === "object" && e.button === 1) {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      } else if (e.button === 0 && type === "vod" && TwitchPlayer.isPaused()) {
        TwitchPlayer.play();
      } else if (typeof e === "object" && e.button === 0 && TwitchPlayer.getMuted()) {
        TwitchPlayer.setMuted(false);
        setVolumeMuted(false);
      }
    };

    const pauseOnSpacebar = e => {
      if (e.keyCode === 32) {
        if (TwitchPlayer.isPaused()) {
          TwitchPlayer.play();
        } else {
          TwitchPlayer.pause();
        }
      }
    };

    const twitchPlayerEventListeners = () => {
      setVolumeMuted(TwitchPlayer.getMuted());

      volumeEventOverlayRefElement.addEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.addEventListener("mouseup", scrollClickMuteVolume);
      document.body.addEventListener("keyup", pauseOnSpacebar);
    };

    TwitchPlayer.addEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);

    return () => {
      TwitchPlayer.removeEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);
      volumeEventOverlayRefElement.removeEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.removeEventListener("mouseup", scrollClickMuteVolume);
      document.body.removeEventListener("keyup", pauseOnSpacebar);
    };
  }, [channel, video, volumeEventOverlayRef, setVolumeMuted, setVolumeText, type]);

  return null;
};

const NonInteractiveVolumeSlider = ({ volumeMuted, volumeText }) => {
  const volumeIcon = () => {
    if (volumeMuted) {
      return volumeMute2;
    } else if (volumeText <= 33) {
      return volumeLow;
    } else if (volumeText <= 66) {
      return volumeMedium;
    } else if (volumeText <= 100) {
      return volumeHigh;
    } else {
      return volumeMute;
    }
  };

  return (
    <div className='vlCtrl'>
      <Icon size={30} icon={volumeIcon()} style={volumeMuted ? { color: "red" } : null} />
      <svg viewBox='0 0 280 27' xmlns='http://www.w3.org/2000/svg'>
        <line
          id='ctrlLineB'
          className='volElem'
          stroke='#B28A24'
          x1='13'
          y1='13.5'
          x2='100'
          y2='13.5'
          opacity='0.6'
        />
        <line
          id='ctrlLineF'
          className='volElem'
          stroke='#F4AF0A'
          x1='13'
          y1='13.5'
          x2={volumeText && volumeText.toFixed(0)}
          y2='13.5'
        />

        <circle
          id='ctrlCirce'
          cx={volumeText + 10 && (volumeText + 10).toFixed(0)}
          cy='13.5'
          r='13'
          fill='#F4AF0A'
        />

        <text
          x={volumeText + 10 && (volumeText + 10).toFixed(0)}
          y='50%'
          textAnchor='middle'
          stroke='#ffffff'
          strokeWidth='2px'
          dy='.3em'>
          {volumeText && volumeText.toFixed(0)}
        </text>
      </svg>
    </div>
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
  const [volumeText, setVolumeText] = useState(null);
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
            <Nav.Link as={NavLink} to={`/twitch/channel/${id}`}>
              <div id='icon'>
                <Icon icon={ic_account_circle} size={20}></Icon>
              </div>
              {id}'s channel page
            </Nav.Link>
          </PlayerNavbar>
        </CSSTransition>

        <VideoAndChatContainer
          style={{
            height: visible ? "calc(100vh - 75px)" : "100vh",
            top: visible ? "75px" : "0",
          }}
          switchedChatState={switched}>
          <div id='twitch-embed'>
            <VolumeEventOverlay ref={volumeEventOverlayRef} type='live'>
              <NonInteractiveVolumeSlider volumeMuted={volumeMuted} volumeText={volumeText} />
            </VolumeEventOverlay>
            <TwitchInteractivePlayer
              channel={id}
              volumeEventOverlayRef={volumeEventOverlayRef}
              setVolumeText={setVolumeText}
              setVolumeMuted={setVolumeMuted}
            />
            <ToggleSwitchChatSide
              id='switchSides'
              switched={switched}
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
              <Nav.Link as={NavLink} to={`/twitch/channel/${nameFromHash}`}>
                <div id='icon'>
                  <Icon icon={ic_account_circle} size={20} />
                </div>
                {nameFromHash}'s channel page
              </Nav.Link>
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
            <NonInteractiveVolumeSlider volumeMuted={volumeMuted} volumeText={volumeText} />
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
            type={"vod"}
          />
        </VideoAndChatContainer>
      </>
    );
  }
};
