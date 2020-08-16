import { StyledCountdownCircle } from './../StyledComponents';
import React, { useState, useEffect } from 'react';

export default ({ startDuration, isLoading, autoRefreshEnabled }) => {
  const [countdown, setCountdown] = useState(startDuration);

  useEffect(() => {
    setCountdown(startDuration);

    const timer = setInterval(() => {
      setCountdown((countdown) => Math.max(0, --countdown));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startDuration]);

  return (
    <StyledCountdownCircle isLoading={isLoading}>
      {autoRefreshEnabled && startDuration && !isLoading && (
        <div id='countdown-number'>{countdown || 0}</div>
      )}
      <svg>
        <circle r='10.8' cx='12' cy='12'></circle>
      </svg>
    </StyledCountdownCircle>
  );
};
