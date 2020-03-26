import { StyledCountdownCircle } from "./../StyledComponents";
import React, { useState, useEffect } from "react";

export default ({ startDuration }) => {
  const [countdown, setCountdown] = useState();

  useEffect(() => {
    setCountdown(startDuration);
    const timer = setInterval(() => {
      setCountdown(countdown => {
        return --countdown <= 0 ? 0 : countdown;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startDuration]);

  return (
    <StyledCountdownCircle
      startPoint={() => {
        // console.log("countdown", (25 - countdown) * (67.8 / 25));
        return (25 - countdown) * (67.8 / 25);
      }}
      startDuration={startDuration}>
      <div id='countdown-number'>{countdown || 0}</div>
      <svg>
        <circle r='10.8' cx='12' cy='12'></circle>
      </svg>
    </StyledCountdownCircle>
  );
};
