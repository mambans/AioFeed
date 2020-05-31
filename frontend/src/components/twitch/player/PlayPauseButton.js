import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

export default ({ TwitchPlayer, PlayerUIControlls }) => {
  const [isPaused, setIsPaused] = useState(false);

  const PausePlay = () => {
    if (TwitchPlayer.isPaused()) {
      TwitchPlayer.play();
      setIsPaused(false);
    } else {
      TwitchPlayer.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    const mouseEvents = (e) => {
      switch (e.button) {
        case 0:
          if (TwitchPlayer.isPaused()) {
            TwitchPlayer.play();
            setIsPaused(false);
          }
          break;
        default:
          break;
      }
    };

    const keyboardEvents = (e) => {
      if (e.key === " " || e.key === "Space") {
        if (!TwitchPlayer.isPaused()) {
          TwitchPlayer.pause();
          setIsPaused(true);
        } else {
          TwitchPlayer.play();
          setIsPaused(false);
        }
      }
    };

    const addEventListeners = () => {
      document.body.addEventListener("keydown", keyboardEvents);
      if (PlayerUIControlls) {
        PlayerUIControlls.addEventListener("mousedown", mouseEvents);
        return () => {
          PlayerUIControlls.removeEventListener("mousedown", mouseEvents);
        };
      }
    };

    if (TwitchPlayer) {
      TwitchPlayer.addEventListener(window.Twitch.Player.READY, addEventListeners);
      return () => {
        TwitchPlayer.removeEventListener(window.Twitch.Player.READY, addEventListeners);
      };
    }

    return () => {
      document.body.removeEventListener("keydown", keyboardEvents);
    };
  }, [TwitchPlayer, PlayerUIControlls]);

  if (isPaused) {
    return <FaPlay id='PausePlay' size={30} onClick={PausePlay} title={"Play (space)"} />;
  } else {
    return <FaPause id='PausePlay' size={30} onClick={PausePlay} title={"Pause (space)"} />;
  }
};
