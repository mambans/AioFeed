import { StyledCountdownCircle } from './../StyledComponents';
import React, { useState, useEffect } from 'react';

export default ({ startDuration }) => {
  const [countdown, setCountdown] = useState(25);

  useEffect(() => {
    setCountdown(startDuration);

    const timer = setInterval(() => {
      setCountdown((countdown) => {
        return --countdown <= 0 ? 0 : countdown;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startDuration]);

  return (
    <StyledCountdownCircle>
      <div id='countdown-number'>{countdown || 0}</div>
      <svg>
        <circle r='10.8' cx='12' cy='12'></circle>
      </svg>
    </StyledCountdownCircle>
  );
};
