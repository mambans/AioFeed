import { StyledCountdownCircle } from "./../StyledComponents";
import React, { useState, useEffect } from "react";

export default ({ startDuration }) => {
  const [countdown, setCountdown] = useState(25);
  // const [delay, setDelay] = useState(0);

  // useEffect(() => {
  //   console.log("-11");
  //   const windowFocusHandler = () => {
  //     console.log("-22");
  //     console.log("windowFocusHandler -> -25 + countdown", -25 + countdown);
  //     if (true) {
  //       console.log(true);
  //       // setDelay(-25 + countdown);
  //       setDelay(countdown);
  //     }
  //   };

  //   window.addEventListener("focus", windowFocusHandler);

  //   return () => {
  //     window.removeEventListener("focus", windowFocusHandler);
  //   };
  // }, [countdown]);

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
    // countdown={countdown}
    // delay={delay}
    // startDuration={startDuration}
    >
      <div id='countdown-number'>{countdown || 0}</div>
      <svg>
        <circle r='10.8' cx='12' cy='12'></circle>
      </svg>
    </StyledCountdownCircle>
  );
};
