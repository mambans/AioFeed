import React from 'react';
import { FaRegEye } from 'react-icons/fa';
import { formatViewerNumbers } from '../TwitchUtils';
import styled from 'styled-components';

const ViewcountContainer = styled.div`
  p {
    display: flex;
    align-items: center;
    margin: 0;
    width: 100%;
    justify-content: end;
  }

  #formated {
    display: flex;
  }

  #unformated {
    display: none;
  }

  &:hover {
    #formated {
      display: none;
    }

    #unformated {
      display: flex;
    }
  }
`;

/**
 * @param {Number} viewers - Viewcount of the stream
 * @param {String} [className] - ClassName's
 * @param {String} [id] - Id's
 * @param {Boolean} [disabeIcon = false] - Disable "eye" Icon
 * @param {Boolean} [disabePrefix = false] - Disable prefix "Viewers:"
 * @param {Boolean} [formatViewcount = true] - Enable formating of viewers >= 10000 to 10k, 14345 oy 14k
 * @returns {Element} <p></p> with viewCount
 */
const AnimatedViewCount = ({
  viewers = 0,
  className,
  id,
  disabeIcon = false,
  disabePrefix = false,
  formatViewcount = true,
}) => {
  // const previousNumber = useRef(0);
  // const [number, setNumber] = useState(previousNumber.current || viewers || 0);
  // const animationTimer = useRef();

  // useEffect(() => {
  //   const animationStepAmount = Math.max(
  //     Math.abs(Math.round((viewers - previousNumber.current) / 750)),
  //     1
  //   );
  //   const step = (curr) => {
  //     const curDif = Math.abs(curr - viewers);
  //     const dec = viewers - curr < 0;

  //     if (curDif <= 0 || curr === viewers) {
  //       clearInterval(animationTimer.current);
  //       previousNumber.current = viewers;
  //       return viewers;
  //     } else if (curDif === 10) {
  //       clearInterval(animationTimer.current);
  //       animationTimer.current = setInterval(() => setNumber(step), 250);
  //       return dec ? curr - 1 : curr + 1;
  //     } else if (curDif === 25) {
  //       clearInterval(animationTimer.current);
  //       animationTimer.current = setInterval(() => setNumber(step), 125);
  //       return dec ? curr - 1 : curr + 1;
  //     } else if (curDif === 50) {
  //       clearInterval(animationTimer.current);
  //       animationTimer.current = setInterval(() => setNumber(step), 50);
  //       return dec ? curr - 1 : curr + 1;
  //     } else if (curDif === 100) {
  //       clearInterval(animationTimer.current);
  //       animationTimer.current = setInterval(() => setNumber(step), 20);
  //       return dec ? curr - 1 : curr + 1;
  //     }

  //     return dec ? curr - 1 : curr + 1;
  //   };

  //   const animate = () => {
  //     setNumber((curr) => {
  //       const dif = viewers - curr;

  //       if (curr === viewers) {
  //         clearInterval(animationTimer.current);
  //         previousNumber.current = viewers;
  //         return viewers;
  //       } else if (dif > 0) {
  //         if (viewers - curr <= 100) {
  //           clearInterval(animationTimer.current);
  //           animationTimer.current = setInterval(() => setNumber(step), 20);
  //           const newNumber = curr + animationStepAmount;
  //           previousNumber.current = newNumber;
  //           return newNumber;
  //         }

  //         requestAnimationFrame(animate);
  //         const newNumber = curr + animationStepAmount;
  //         previousNumber.current = newNumber;
  //         return newNumber;
  //       } else if (dif < 0) {
  //         if (curr - viewers <= 100) {
  //           clearInterval(animationTimer.current);
  //           animationTimer.current = setInterval(() => setNumber(step), 20);
  //           const newNumber = curr - animationStepAmount;
  //           previousNumber.current = newNumber;
  //           return newNumber;
  //         }

  //         requestAnimationFrame(animate);
  //         const newNumber = curr - animationStepAmount;
  //         previousNumber.current = newNumber;
  //         return newNumber;
  //       }
  //       previousNumber.current = viewers;
  //       return viewers;
  //     });
  //   };

  //   clearInterval(animationTimer.current);
  //   requestAnimationFrame(animate);

  //   return () => {
  //     clearTimeout(animationTimer.current);
  //   };
  // }, [viewers]);

  return (
    <ViewcountContainer title='Viewers' className={className} id={id}>
      <p id='formated'>
        {!disabePrefix && 'Viewers:'} {formatViewcount ? formatViewerNumbers(viewers) : viewers}
        {!disabeIcon && <FaRegEye size={12} />}
      </p>
      <p id='unformated'>
        {!disabePrefix && 'Viewers:'} {viewers}
        {!disabeIcon && <FaRegEye size={12} />}
      </p>
    </ViewcountContainer>
  );
};
export default AnimatedViewCount;
