import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { msToHMS } from '../../../util';

const PlayPauseButton = ({ TwitchPlayer, PlayerUIControlls }) => {
  const [isPaused, setIsPaused] = useState(TwitchPlayer?.isPaused() || false);
  const seekresetTimer = useRef();
  // eslint-disable-next-line no-unused-vars
  const [seekTime, setSeekTime] = useState();

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
    switch (e.key) {
      case 'Space':
      case ' ':
        e.preventDefault();
        if (!TwitchPlayer.isPaused()) {
          TwitchPlayer.pause();
          setIsPaused(true);
        } else {
          TwitchPlayer.play();
          setIsPaused(false);
        }

        break;
      case 'ArrowRight':
        setSeekTime((c) => {
          clearTimeout(seekresetTimer.current);
          const curr = c || TwitchPlayer?.getCurrentTime();
          TwitchPlayer?.seek(curr + 10);
          seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
          return curr + 10;
        });
        return;
      case 'ArrowLeft':
        setSeekTime((c) => {
          clearTimeout(seekresetTimer.current);
          const curr = c || TwitchPlayer?.getCurrentTime();
          TwitchPlayer?.seek(curr - 10);
          seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
          return curr - 10;
        });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(seekresetTimer.current);
    };
  }, []);

  const button = (() => {
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
  })();

  return (
    <div>
      {seekTime && <p>{msToHMS(seekTime * 1000)}</p>}
      {button}
    </div>
  );
};
export default PlayPauseButton;
