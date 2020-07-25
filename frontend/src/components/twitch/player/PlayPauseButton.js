import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import useEventListener from '../../../hooks/useEventListener';

export default ({ TwitchPlayer, PlayerUIControlls }) => {
  const [isPaused, setIsPaused] = useState(false);

  useEventListener('keydown', keyboardEvents, window, window.Twitch.Player.READY);
  useEventListener('mousedown', mouseEvents, PlayerUIControlls, window.Twitch.Player.READY);

  function PausePlay() {
    if (TwitchPlayer.isPaused()) {
      TwitchPlayer.play();
      setIsPaused(false);
    } else {
      TwitchPlayer.pause();
      setIsPaused(true);
    }
  }

  function mouseEvents(e) {
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
  }

  function keyboardEvents(e) {
    if (e.key === ' ' || e.key === 'Space') {
      if (!TwitchPlayer.isPaused()) {
        TwitchPlayer.pause();
        setIsPaused(true);
      } else {
        TwitchPlayer.play();
        setIsPaused(false);
      }
    }
  }

  if (isPaused) {
    return (
      <FaPlay
        disabled={!TwitchPlayer}
        id='PausePlay'
        size={30}
        onClick={PausePlay}
        title={'Play (space)'}
      />
    );
  } else {
    return (
      <FaPause
        disabled={!TwitchPlayer}
        id='PausePlay'
        size={30}
        onClick={PausePlay}
        title={'Pause (space)'}
      />
    );
  }
};
