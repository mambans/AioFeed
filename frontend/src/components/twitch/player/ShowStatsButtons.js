import React, { useState, useRef, useEffect } from "react";
import { ButtonShowStats, PlaybackStats } from "./StyledComponents";

export default ({ TwitchPlayer }) => {
  const [showPlaybackStats, setShowPlaybackStats] = useState();
  const [playbackStats, setPlaybackStats] = useState();
  const PlayersatsTimer = useRef();

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

  useEffect(() => {
    return () => {
      clearInterval(PlayersatsTimer.current);
    };
  }, []);

  return (
    <>
      {showPlaybackStats && playbackStats && (
        <PlaybackStats>
          {Object.keys(playbackStats).map((statName) => {
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
      )}
      <ButtonShowStats
        title='Show video stats'
        onClick={() => {
          if (!showPlaybackStats) {
            document.querySelector("#controls").style.opacity = 1;
            PlayersatsTimer.current = setInterval(() => {
              setPlaybackStats(TwitchPlayer.getPlaybackStats());
            }, 1500);
          } else {
            document.querySelector("#controls").style.removeProperty("opacity");
            clearInterval(PlayersatsTimer.current);
          }
          setShowPlaybackStats(!showPlaybackStats);
          setPlaybackStats(TwitchPlayer.getPlaybackStats());
        }}
      />
    </>
  );
};
