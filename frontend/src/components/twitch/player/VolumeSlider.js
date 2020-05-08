import { FaVolumeMute } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { MdVolumeDown } from "react-icons/md";
import { MdVolumeMute } from "react-icons/md";
import { MdVolumeUp } from "react-icons/md";
import React, { useState, useEffect } from "react";
import Slider from "react-rangeslider";

import { StyledVolumeSlider } from "./StyledComponents";
import "react-rangeslider/lib/index.css";

export default ({ TwitchPlayer, OpenedDate, volumeEventOverlayRef }) => {
  const [volumeText, setVolumeText] = useState(0);
  const [volumeMuted, setVolumeMuted] = useState(true);

  const volumeIcon = () => {
    const attrs = {
      id: "icon",
      size: 30,
      style: {
        color: volumeMuted ? "#bd0202" : "inherit",
      },
      onClick: () => {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      },
    };
    let IconVolume = MdVolumeMute;

    if (volumeMuted) {
      IconVolume = FaVolumeMute;
    } else if (volumeText < 1) {
      IconVolume = MdVolumeMute;
    } else if (volumeText <= 33) {
      IconVolume = MdVolumeDown;
    } else if (volumeText <= 66) {
      IconVolume = MdVolumeUp;
    } else if (volumeText <= 100) {
      IconVolume = FaVolumeUp;
    } else {
      IconVolume = MdVolumeMute;
    }

    return <IconVolume {...attrs} />;
  };

  const handleChange = (value) => {
    if (TwitchPlayer.getMuted()) {
      TwitchPlayer.setMuted(false);
      setVolumeMuted(false);
    }
    setVolumeText(value);
    TwitchPlayer.setVolume(value / 100);
  };

  useEffect(() => {
    const changeVolume = (operator, amount) => {
      const newVolume = Math.min(
        Math.max(
          operator === "increase"
            ? TwitchPlayer.getVolume() + amount
            : TwitchPlayer.getVolume() - amount,
          0
        ),
        1
      );

      TwitchPlayer.setVolume(newVolume);
      setVolumeText(newVolume * 100);
    };
    const scrollChangeVolumeEvent = (e) => {
      if ((e.wheelDelta && e.wheelDelta > 0) || e.deltaY < 0) {
        changeVolume("increase", 0.01);
      } else {
        changeVolume("decrease", 0.01);
      }
    };

    const mouseEvents = (e) => {
      switch (e.button) {
        case 1:
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          setVolumeMuted(!TwitchPlayer.getMuted());
          break;

        case 0:
          if (!TwitchPlayer.isPaused() && new Date().getTime() - OpenedDate.current <= 15000) {
            TwitchPlayer.setMuted(false);
            setVolumeMuted(false);
            setVolumeText(TwitchPlayer.getVolume() * 100);
          }
          break;
        default:
          break;
      }
    };

    const keyboardEvents = (e) => {
      switch (e.key) {
        case "m":
        case "M":
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          // setVolumeMuted(!TwitchPlayer.getMuted());
          break;
        case "ArrowDown":
          changeVolume("decrease", 0.05);
          break;
        case "ArrowUp":
          changeVolume("increase", 0.05);
          break;
        default:
          break;
      }
    };

    const addEventListeners = () => {
      document.body.addEventListener("mousedown", mouseEvents);
      document.body.addEventListener("keydown", keyboardEvents);

      if (volumeEventOverlayRef) {
        volumeEventOverlayRef.addEventListener("mousedown", mouseEvents);
        volumeEventOverlayRef.addEventListener("wheel", scrollChangeVolumeEvent);

        return () => {
          volumeEventOverlayRef.removeEventListener("mousedown", mouseEvents);
          volumeEventOverlayRef.removeEventListener("wheel", scrollChangeVolumeEvent);
        };
      }
    };

    const OnPlayingEventListeners = () => {
      if (TwitchPlayer) {
        setVolumeMuted(TwitchPlayer.getMuted());
        setVolumeText(TwitchPlayer.getVolume() * 100);
      }
    };

    if (TwitchPlayer) {
      TwitchPlayer.addEventListener(window.Twitch.Player.READY, addEventListeners);
      TwitchPlayer.addEventListener(window.Twitch.Player.PLAYING, OnPlayingEventListeners);

      return () => {
        TwitchPlayer.removeEventListener(window.Twitch.Player.READY, addEventListeners);
        TwitchPlayer.removeEventListener(window.Twitch.Player.PLAYING, OnPlayingEventListeners);
      };
    }

    return () => {
      document.body.removeEventListener("mousedown", mouseEvents);
      document.body.removeEventListener("keydown", keyboardEvents);
    };
  }, [OpenedDate, TwitchPlayer, volumeEventOverlayRef]);

  return (
    <StyledVolumeSlider volumeMuted={volumeMuted}>
      <h3 className='value'>{volumeText && volumeText.toFixed(0)}</h3>

      <div id='BottomRow'>
        {volumeIcon()}
        <Slider value={volumeText} orientation='horizontal' onChange={handleChange} />
      </div>
    </StyledVolumeSlider>
  );
};
