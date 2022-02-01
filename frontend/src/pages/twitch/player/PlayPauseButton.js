import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

const PlayPauseButton = ({ TwitchPlayer, PlayerUIControlls }) => {
  const [isPaused, setIsPaused] = useState(TwitchPlayer?.isPaused() || false);

  useEventListenerMemo(
    'keydown',
    keyboardEvents,
    document.querySelector('#MainContentContainer'),
    window?.Twitch?.Player?.READY
  );
  useEventListenerMemo('mousedown', mouseEvents, PlayerUIControlls, window?.Twitch?.Player?.READY);
  useEventListenerMemo(
    window?.Twitch?.Player?.PLAY,
    () => setIsPaused(false),
    TwitchPlayer,
    window?.Twitch?.Player?.READY
  );
  useEventListenerMemo(
    window?.Twitch?.Player?.PAUSE,
    () => setIsPaused(true),
    TwitchPlayer,
    window?.Twitch?.Player?.READY
  );

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
  }
  return (
    <FaPause
      disabled={!TwitchPlayer}
      id='PausePlay'
      size={30}
      onClick={PausePlay}
      title={'Pause (space)'}
    />
  );
};
export default PlayPauseButton;
