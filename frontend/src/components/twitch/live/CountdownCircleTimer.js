import { StyledCountdownCircle } from './../StyledComponents';
import React, { useState, useEffect } from 'react';

export default ({ startDuration, isLoading, autoRefreshEnabled, style = {}, size = 24 }) => {
  const [countdown, setCountdown] = useState(startDuration);

  useEffect(() => {
    if (startDuration) {
      setCountdown(startDuration);

      const timer = setInterval(() => setCountdown((countdown) => Math.max(0, --countdown)), 1000);

      return () => clearInterval(timer);
    }
  }, [startDuration]);

  return (
    <StyledCountdownCircle isLoading={isLoading} style={style} size={size}>
      {autoRefreshEnabled && startDuration && !isLoading && (
        <div id='countdown-number'>{countdown || 0}</div>
      )}
      <svg>
        <circle r={size / 2 - 2} cx={size / 2} cy={size / 2}></circle>
      </svg>
    </StyledCountdownCircle>
  );
};
