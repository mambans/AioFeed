import React, { useState, useRef, useEffect } from 'react';
import { ButtonShowStats, PlaybackStats } from './StyledComponents';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

export const latencyColorValue = (name, value) => {
  if (name === 'hlsLatencyBroadcaster' || name === 'hlsLatencyEncoder') {
    if (value >= 10) {
      return '#f00';
    } else if (value >= 5) {
      return '#f66329';
    } else if (value >= 2.5) {
      return '#f6b029';
    } else {
      return '#4cf629';
    }
  } else {
    return 'unset';
  }
};

const ShowStatsButtons = ({ TwitchPlayer }) => {
  const [showPlaybackStats, setShowPlaybackStats] = useState();
  const [playbackStats, setPlaybackStats] = useState();
  const PlayersatsTimer = useRef();

  useEventListenerMemo(
    'keydown',
    keyboardEvents,
    document.querySelector('#MainContentContainer'),
    TwitchPlayer
  );

  const ToggleShowStats = (event = { stopPropagation: () => {}, preventDefault: () => {} }) => {
    event.stopPropagation();
    event.preventDefault();
    if (!showPlaybackStats) {
      if (PlayersatsTimer.current) clearInterval(PlayersatsTimer.current);
      document.querySelector('#controls').style.opacity = 1;
      PlayersatsTimer.current = setInterval(() => {
        setPlaybackStats(TwitchPlayer.getPlaybackStats());
      }, 750);
    } else {
      document.querySelector('#controls').style.removeProperty('opacity');
      clearInterval(PlayersatsTimer.current);
    }
    setShowPlaybackStats(!showPlaybackStats);
    setPlaybackStats(TwitchPlayer.getPlaybackStats());
  };

  function keyboardEvents(e) {
    switch (e.key) {
      case 's':
      case 'S':
        ToggleShowStats();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(PlayersatsTimer.current);
    };
  }, []);

  return (
    <div>
      {showPlaybackStats && playbackStats && (
        <PlaybackStats>
          {Object.keys(playbackStats).map((statName) => (
            <div key={statName}>
              <span>{`${statName}: `}</span>
              <span
                style={{
                  color: latencyColorValue(statName, playbackStats[statName]),
                }}
              >
                {playbackStats[statName]}
              </span>
            </div>
          ))}
        </PlaybackStats>
      )}
      <ButtonShowStats
        disabled={!TwitchPlayer}
        title='Show video stats (s)'
        onClick={ToggleShowStats}
      />
    </div>
  );
};
export default ShowStatsButtons;
