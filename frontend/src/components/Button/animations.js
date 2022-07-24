import { keyframes } from 'styled-components';

export const buttonBubbleAnimation = (disableClickAnimation = false, size = 1) =>
  keyframes`
  0% {
    transform: ${!disableClickAnimation && 'scale(1)'};
    filter: brightness(1) saturate(1);

  }
  50% {
      transform: ${!disableClickAnimation && `scale(${1 + (size - 1) * 0.5})`};
      filter: brightness(1.15) saturate(1.15);
    }
  70% {
    transform: ${!disableClickAnimation && 'scale(1)'};
    filter: brightness(1) saturate(1);
  }
  80% {
    transform: ${!disableClickAnimation && `scale(${1 * size})`};
    filter: brightness(1.35) saturate(1.35);
  }
  100% {
    transform: ${!disableClickAnimation && 'scale(1)'};
    filter: brightness(1) saturate(1);
  }
`;

export const buttonBubbleAnimationSingle = (disableClickAnimation = false, size = 1) =>
  keyframes`
  0% {
    transform: ${!disableClickAnimation && 'scale(1)'};
    filter: brightness(1) saturate(1);

  }
  70% {
    transform: ${!disableClickAnimation && `scale(${1 * size})`};
    filter: brightness(1.35) saturate(1.35);
  }
  100% {
    transform: ${!disableClickAnimation && 'scale(1)'};
    filter: brightness(1) saturate(1);
  }
`;

export const svgAnimation = ({ iconActiveColor }) => keyframes`
  75% {
      color: ${iconActiveColor};
  }
`;

export const loadingAnimation = keyframes`
 	100% {
		transform: rotate(1turn);
	}
`;
