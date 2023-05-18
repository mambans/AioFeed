import styled, { css, keyframes } from 'styled-components';
import { Button, Form } from 'react-bootstrap';

export const TransparentButton = styled.button`
  &&& {
    background: transparent;
    border: none;
    color: none;
    display: flex;
    outline: none;

    &:hover,
    &:active,
    &:focus {
      background: none;
      border: none;
      color: none;
    }
  }
  color: white;
`;

export const StyledListForm = styled(Form)`
  /* margin: 10px; */
  height: 60px;

  &:hover,
  &:focus-within,
  &:focus {
    opacity: 1 !important;
  }

  input {
    color: rgb(200, 200, 200);
    background-color: transparent;
    border: none;
    padding: 0.1875rem 0.75rem;
    height: calc(1.5em + 0.5rem + 0px);
    border-bottom: 2px solid rgb(75, 75, 75);
    border-radius: 0;
  }

  &.ListForm-appear {
    opacity: 0;
    height: 0;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-appear-active {
    opacity: 1;
    height: 60px;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-appear-done {
    opacity: 1;
    height: 60px;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter {
    opacity: 0;
    height: 0;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter-done {
    opacity: 1;
    height: 60px;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter-active {
    opacity: 1;
    height: 60px;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit {
    opacity: 1;
    height: 60px;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit-active {
    opacity: 0;
    height: 0;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit-done {
    opacity: 0;
    height: 0;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }
`;

export const HeaderOuterMainContainer = styled.header`
  width: 100%;
  margin-bottom: 5px;
  scroll-margin-top: 95px;

  ${StyledListForm} {
    height: max-content;
  }
`;

export const HeaderNumberCountContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: start;
  margin: 0 5px;
  font-size: 0.65em;
  color: rgb(224, 224, 224);
`;

export const HeaderTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;
`;

export const LeftRightDivs = styled.div`
  /* align-items: end; */
  align-items: center;
  display: flex;
  position: relative;
  gap: 1rem;
`;

export const ButtonLookalikeStyle = css`
  color: var(--refreshButtonColor);
  background: var(--navigationbarBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  transition: color 250ms, background-color 250ms, border-color 250ms, box-shadow 250ms,
    opacity 250ms, filter 250ms;
  text-transform: capitalize;
  border-radius: 5px;

  /* &:active,
  &:focus, */
  &:hover {
    filter: brightness(1.2);
  }
`;

export const HeaderLines = styled.div`
  height: 2px;
  background-color: var(--subFeedHeaderBorder);
  width: 100%;
`;

export const HeaderTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
  min-height: 25px;

  svg {
    margin-left: 10px;
  }

  h1 {
    position: relative;
    cursor: pointer;
    text-align: center;
    color: var(--textColor3);
    margin: auto;
    letter-spacing: 1px;
    margin: 2px auto;
    display: flex;
    margin: 0 10px;
    font-size: 1.3rem;
    transition: margin 500ms, color 500ms;
    align-items: center;
    min-width: max-content;
    height: 25px;

    img,
    .imgPlaceholder {
      height: 130%;
      border-radius: 5px;
      margin-right: 10px;
      width: 25px;
      background: var(--navigationbarBackground);
      opacity: 0.7;
    }

    &:hover {
      margin: 0 50px;
      color: var(--textColor1);
    }
  }
`;

const InfinitSpinnig = keyframes`
0% {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
`;

const countdown = keyframes`
from {
  stroke-dashoffset: 0px;
}
to {
  stroke-dashoffset: 67.8px;
}
`;

const spinnigAnimation = () => css`
  ${InfinitSpinnig} ${'1s infinite'};
`;

const countdownAnimation = () => css`
  ${countdown} 25s linear 1 forwards;
`;

export const StyledCountdownCircle = styled.div`
  position: relative;
  margin: auto;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;

  div#countdown-number {
    display: inline-block;
    line-height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    font-size: 12px;
    display: flex;
    justify-content: center;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    animation: ${({ isLoading }) => isLoading && spinnigAnimation};
  }

  svg circle {
    stroke-dasharray: ${({ isLoading, size }) =>
      isLoading ? 2 * 3.14 * (size / 2 - 2) * 0.7 : 2 * 3.14 * (size / 2 - 2)}px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 3px;
    stroke: var(--refreshButtonColor);
    fill: none;
    animation: ${({ isLoading }) => !isLoading && countdownAnimation};

    animation-delay: 0s;
  }
`;

export const VideosContainer = styled.div`
  display: flex;
  flex-wrap: ${({ dragging }) => (dragging ? 'unset' : 'wrap')};
  overflow: ${({ dragging }) => (dragging ? 'scroll' : 'unset')};
  /* min-height: 307px; */
`;

export const SearchListError = styled.span`
  position: absolute;
  top: 0;
  transform: translateY(-100%);
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c30000;
  padding: 3px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ gap }) => gap || '1rem'};
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justifyContent }) => justifyContent};
`;

export const StyledButton = styled(Button).attrs(({ type }) => ({
  type: type || 'submit',
  variant: 'secondary',
}))`
  &&& {
    border: none;
    box-shadow: none;
  }

  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-left: 10px; */
  padding: 0.5rem 0.5rem;
  opacity: 0.5;
  transition: opacity 250ms, background 250ms;

  &:hover {
    opacity: 1;
    background: rgba(50, 50, 50, 0.25);
  }
`;
