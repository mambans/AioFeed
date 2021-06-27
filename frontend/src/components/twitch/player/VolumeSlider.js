import { FaVolumeMute } from 'react-icons/fa';
import { FaVolumeUp } from 'react-icons/fa';
import { MdVolumeDown } from 'react-icons/md';
import { MdVolumeMute } from 'react-icons/md';
import { MdVolumeUp } from 'react-icons/md';
import React, { useState } from 'react';
import Slider from 'react-rangeslider';

import { StyledVolumeSlider } from './StyledComponents';
import 'react-rangeslider/lib/index.css';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

const VolumeSlider = ({
  TwitchPlayer,
  OpenedDate,
  PlayerUIControlls,
  setShowControlls,
  showAndResetTimer,
}) => {
  const [volumeText, setVolumeText] = useState(0);
  const [volumeMuted, setVolumeMuted] = useState(true);

  useEventListenerMemo('keydown', keyboardEvents, window, window?.Twitch?.Player?.READY);
  useEventListenerMemo(
    'wheel',
    scrollChangeVolumeEvent,
    PlayerUIControlls,
    window?.Twitch?.Player?.READY
  );
  useEventListenerMemo('mousedown', mouseEvents, PlayerUIControlls, window?.Twitch?.Player?.READY);
  useEventListenerMemo(
    window?.Twitch?.Player?.PLAYING,
    OnPlayingEventListeners,
    TwitchPlayer,
    TwitchPlayer
  );

  const volumeIcon = () => {
    const attrs = {
      id: 'icon',
      size: 30,
      style: {
        color: volumeMuted ? '#bd0202' : 'inherit',
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

    return <IconVolume {...attrs} title={volumeMuted ? 'Unmute (m)' : 'Mute (m)'} />;
  };

  const handleChange = (value) => {
    if (TwitchPlayer.getMuted()) {
      TwitchPlayer.setMuted(false);
      setVolumeMuted(false);
    }
    setVolumeText(value);
    TwitchPlayer.setVolume(value / 100);
  };

  function mouseEvents(e) {
    switch (e.button) {
      case 1:
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
        break;
      case 0:
        if (!TwitchPlayer.isPaused() && Date.now() - OpenedDate.current <= 15000) {
          TwitchPlayer.setMuted(false);
          setVolumeMuted(false);
          setVolumeText(TwitchPlayer.getVolume() * 100);
        }
        break;
      default:
        break;
    }
  }

  function keyboardEvents(e) {
    showAndResetTimer();
    switch (e.key) {
      case 'm':
      case 'M':
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
        break;
      case 'ArrowDown':
        changeVolume('decrease', 0.05);
        break;
      case 'ArrowUp':
        changeVolume('increase', 0.05);
        break;
      default:
        break;
    }
  }
  function changeVolume(operator, amount) {
    setShowControlls(true);
    setVolumeText((volumeText) => {
      const newVolume = Math.min(
        Math.max(
          operator === 'increase' ? volumeText / 100 + amount : volumeText / 100 - amount,
          0.01
        ),
        1
      );

      setShowControlls(true);
      TwitchPlayer.setVolume(newVolume);
      return newVolume * 100;
    });
  }
  function scrollChangeVolumeEvent(e) {
    if (e?.wheelDelta > 0 || e.deltaY < 0) {
      changeVolume('increase', 0.01);
    } else {
      changeVolume('decrease', 0.01);
    }
  }

  function OnPlayingEventListeners() {
    setVolumeMuted(TwitchPlayer?.getMuted());
    setVolumeText(TwitchPlayer?.getVolume() * 100);
  }

  return (
    <StyledVolumeSlider
      volumeMuted={volumeMuted}
      disabled={!TwitchPlayer}
      left={Math.round(15 + 157 * (volumeText?.toFixed(0) / 100))}
    >
      <div className='value'>
        <h3>{volumeText?.toFixed(0)}</h3>
      </div>

      <div id='BottomRow'>
        {volumeIcon()}
        <Slider
          value={volumeText}
          orientation='horizontal'
          onChange={handleChange}
          tooltip={false}
        />
      </div>
    </StyledVolumeSlider>
  );
};
export default VolumeSlider;
