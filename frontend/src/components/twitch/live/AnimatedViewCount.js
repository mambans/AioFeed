import React, { useState, useEffect, useRef } from "react";
import { FaRegEye } from "react-icons/fa";
import { formatViewerNumbers } from "../TwitchUtils";

export default ({ viewers = 0, className, id, disabeIcon = false, disabePrefix = false }) => {
  const previousNumber = useRef(0);
  const [number, setNumber] = useState(previousNumber.current || viewers || 0);
  const animationTimer = useRef();

  useEffect(() => {
    const differrence = viewers - previousNumber.current;
    const incrementAmount = (curr) => {
      if (Math.abs(viewers - curr) <= 15) {
        return 1;
      } else if (Math.abs(viewers - curr) <= 30) {
        return 2;
      } else if (Math.abs(viewers - curr) <= 50) {
        return 3;
      } else if (Math.abs(viewers - curr) <= 150) {
        return 6;
      } else if (Math.abs(viewers - curr) <= 250) {
        return 9;
      } else if (Math.abs(viewers - curr) <= 750) {
        return 37;
      } else if (Math.abs(viewers - curr) <= 1500) {
        return 37;
      }
      return 173;
    };

    if (differrence === 0) {
      if (animationTimer.current) clearInterval(animationTimer.current);
      setNumber(viewers);
    } else {
      animationTimer.current = setInterval(() => {
        // requestAnimationFrame(() => {
        setNumber((curr) => {
          if (differrence > 0) {
            if (curr >= viewers) {
              if (animationTimer.current) clearInterval(animationTimer.current);
              previousNumber.current = curr;
              return curr;
            }
            return curr + incrementAmount(curr);
          } else if (differrence < 0) {
            if (curr <= viewers) {
              if (animationTimer.current) clearInterval(animationTimer.current);
              previousNumber.current = curr;
              return curr;
            }
            return curr - incrementAmount(curr);
          }
          if (animationTimer.current) clearInterval(animationTimer.current);
          previousNumber.current = curr;
          return curr;
        });
        // });
      }, 75);
    }

    return () => {
      if (animationTimer.current) clearInterval(animationTimer.current);
    };
  }, [viewers]);

  return (
    <p title='Viewers' className={className} id={id}>
      {!disabePrefix && "Viewers:"} {formatViewerNumbers(number)}
      {!disabeIcon && <FaRegEye size={14} />}
    </p>
  );
};
