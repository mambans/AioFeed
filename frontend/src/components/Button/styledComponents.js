import styled, { keyframes } from 'styled-components';
import { loadingAnimation, buttonBubbleAnimation, svgAnimation } from './animations';

export const COLORS = {
  danger: { background: 'rgb(162, 28, 28)' },
  success: { background: 'rgb(34, 146, 11)' },
  light: { background: 'rgb(200,200,200)', color: 'rgb(15,15,15)' },
  default: { background: 'rgb(100, 100, 100)', color: '#ffffff' },
  transparent: { background: 'transparent', color: '#ffffff', loadingColor: '#ffffff' },
};

const variantProps = (variant) => {
  const style = COLORS?.[variant];
  const bg = style?.background || COLORS.default.background;
  const color = style?.color || COLORS.default.color;
  return { backgroundColor: bg, color };
};

const variantPropsInner = (variant) => {
  const bg = COLORS?.[variant].background || COLORS.default.background;
  return { boxShadow: `0px 0px 2px 0px ${bg}` };
};

const variantLoading = (variant) => {
  const bg = COLORS?.[variant]?.loadingColor || (variant === 'light' ? 'rgb(15,15,15)' : '#ffffff');
  return {
    backgroundImage: `linear-gradient(transparent, transparent), linear-gradient(${bg}, ${bg}),
    linear-gradient(transparent, transparent), linear-gradient(transparent, transparent)`,
  };
};

export const Inner = styled.div`
  cursor: 'pointer';
`;
export const LoadingDiv = styled.div`
  position: absolute;
  z-index: -2;
  left: -50%;
  height: ${({ parent = {} }) =>
    Math.sqrt(Math.pow(parent.height, 2) + Math.pow(parent.width, 2))}px;
  width: 200%;
  height: ${({ parent = {} }) =>
    Math.sqrt(Math.pow(parent.height, 2) + Math.pow(parent.width, 2))}px;

  background-color: transparent;
  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-position: 0 0, 100% 0, 100% 100%, 0 100%;
  animation-name: ${loadingAnimation};
  animation-duration: 2500ms;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

export const Animate = styled.div`
  display: inline-flex;
  position: relative;
`;

export const StyledButton = styled.button`
  position: relative;
  padding: 0;
  display: flex;
  justify-items: center;
  align-items: center;
  border: none;
  font-weight: 600;
  border-radius: 0.2rem;
  color: #ffffff;
  overflow: hidden;
  transition: filter 250ms;

  pointer-events: ${({ tempDisabled }) => (tempDisabled ? 'none' : 'auto')};

  animation-name: ${({ active, disableClickAnimation }) =>
    active && buttonBubbleAnimation(disableClickAnimation)};
  animation-duration: ${({ duration }) => duration}ms;

  /* svg {
    animation-duration: ${({ duration }) => duration}ms;
    animation-name: ${({ active, iconActiveColor }) => active && svgAnimation({ iconActiveColor })};
  } */

  :not(:disabled) {
    box-shadow: ${({ shadowColor = 'rgb(50, 50, 50)' }) => `1px 1px 1px ${shadowColor}`};
  }

  ${({ variant }) => variantProps(variant)};
  ${({ backgroundColor }) => backgroundColor && { backgroundColor }};
  ${({ color }) => color && { color }};
  transform: scale(1);

  ${Animate} {
    animation-name: ${({ active }) => active && buttonBubbleAnimation(false, 1.35)};
    animation-duration: ${({ duration }) => duration}ms;
  }

  ${Inner} {
    padding: 0.35rem 0.75rem;
    margin: 2px; // controlls the thinkess of the loading border snake
    ${({ backgroundColor }) => backgroundColor && { backgroundColor }};
    ${({ variant }) => variantProps(variant)};
    transition: filter 250ms, box-shadow 250ms;
    border-radius: 0.15em;
  }

  ${LoadingDiv} {
    ${({ variant }) => variantLoading(variant)}
  }

  /* &[disabled] */
  &:disabled {
    filter: brightness(0.6);
  }

  &:hover:not(:disabled) {
    /* box-shadow: ${({ shadowColor = 'rgb(84, 84, 84)' }) => `2px 2px 2px ${shadowColor}`}; */
    ${Inner} {
      filter: ${({ active }) => `brightness(${active ? 1 : 1.25})`};
      ${({ variant }) => variantPropsInner(variant)};
    }
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;

const loadingBarAnimation = keyframes`
 0% {
   left: 0;
   width: 2px;
 }
 25% {
   left: 0;
   width: 100%;
 }
 26% {
   left: unset;
 }
 50% {
   right: 0;
   width: 2px;
 }
 51% {
  left: unset;
 }
 75% {
   right: 0;
   width: 100%;
 }
 100% {
   left: 0;
   width: 2px;
 }

`;

export const LoadingDivTransparent = styled.div`
  position: absolute;
  background-color: ${({ variant }) => COLORS?.[variant]?.loadingColor || 'blue'};
  height: 2px;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 2;

  animation: ${loadingBarAnimation} 2000ms linear infinite;
`;
