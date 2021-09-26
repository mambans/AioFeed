import React from 'react';
import { Button } from 'react-bootstrap';
import styled, { css, keyframes } from 'styled-components';
import { pulse } from '../StyledComponents';
import { MdRefresh } from 'react-icons/md';

const SingelScheduleItemHight = 150;
const SingelScheduleItemTotalHeight = 150 + 20;
export const nrOfItems = 3;

export const ScheduleListContainer = styled.div`
  width: 420px;
  background-color: rgb(38, 38, 38);
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
  height: ${({ error, nrOfItemsP }) =>
    error ? 'auto' : `${SingelScheduleItemTotalHeight * (nrOfItemsP || nrOfItems) + 10}px`};
  overflow: auto;
  position: absolute;
  right: 0px;
  margin-top: 10px;
  z-index: 12;
  margin-right: 10px;

  br {
    display: flex;
  }
`;

const loadingAnimation = css`
  animation: ${pulse} 2s linear infinite;
`;

const pulseOpacity = keyframes`
  0% {opacity 1;
    height: 100%;
    bottom: 0px;
  }
  50% {
    opacity 0;
    height: 10%;
  }
  100% {
    opacity 1;
    height: 100%;
    top: 0;
  }
`;

const loadingAnimationOpacity = css`
  animation: ${pulseOpacity} 2s linear infinite;
`;

export const StyledSchedule = styled.div`
  /* width: calc(100% - 20px); */
  &&& {
    color: #fff;
  }

  height: ${SingelScheduleItemHight}px;
  position: relative;
  background: rgb(50, 50, 50);
  padding: 10px;
  padding-left: 15px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: grid;
  grid-template-areas: 'time image' 'duration image' 'title image' 'game image' 'channel image';
  grid-template-columns: auto 30%;
  grid-column-gap: 10px;
  grid-template-rows: 15% 20% auto;
  align-items: center;
  margin: 10px;
  ${({ loading }) => (loading === 'true' ? loadingAnimation : null)};

  &::before {
    content: '';
    width: 5px;
    position: absolute;
    height: 100%;
    left: -5px;
    background-color: #e27626;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    ${({ loading }) => (loading === 'true' ? loadingAnimationOpacity : null)};
  }

  p,
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
  }

  a:hover {
    text-decoration: underline;
  }

  .start {
    grid-area: time;
    font-weight: bold;
    font-size: 0.7em;
  }
  .end {
    grid-area: time;
    font-weight: bold;
    font-size: 0.7em;
  }
  .time {
    display: flex;
    justify-content: space-between;
    height: min-content;
    font-size: 0.9em;
    align-items: center;

    time {
      transition: font-size 150ms;
      &:hover {
        font-size: 0.9em;
      }
    }
  }
  .title {
    grid-area: title;
    margin: 0;
  }
  .game {
    grid-area: game;
    font-size: 0.8em;
    width: min-content;
  }
  .channel {
    grid-area: channel;
    font-size: 0.8em;
    width: min-content;
    font-weight: bold;
    align-self: flex-end;
    text-transform: capitalize;
  }
  .image {
    grid-area: image;
    height: 100%;
    padding: 2px;
    border-radius: 20px;
    justify-self: end;
    object-fit: cover;
    width: 100%;
  }
  .secondTimeRow {
    grid-area: duration;
    height: min-content;
    font-weight: bold;
    justify-content: space-between;
    display: flex;

    .duration::after {
      content: 'h';
    }
  }
`;

export const Container = styled.div`
  position: ${({ absolute }) => (absolute === 'true' ? 'absolute' : 'relative')};
  right: 18px;
  top: 50px;
  z-index: 3;
  grid-column: video-start;
  pointer-events: auto;
`;

export const StyledButton = styled(Button)`
  &&& {
    border: none;
    background: none;
    box-shadow: none;
  }
  padding: 5px;
  z-index: 3;
  transition: color 250ms, background-color 250ms, opacity 250ms;
  position: ${({ absolute }) => (absolute === 'true' ? 'absolute' : 'unset')};
  right: 0;
  opacity: 0.7;

  svg {
    fill: hsl(0, 0%, 75%);
    transition: fill 250ms;
  }

  &:hover,
  &:focus {
    opacity: 1;

    svg {
      fill: hsl(0, 0%, 100%);
    }
  }
`;

export const CloseOverlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2;
`;

export const RefreshBtnIcon = styled(MdRefresh).attrs({ size: 16 })``;
export const RefreshBtnContainer = styled.div`
  position: absolute;
  /* bottom: 0; */
  right: 50px;
  margin: 5px;
  opacity: 0.5;
  pointer-events: ${({ loading }) => (loading === 'true' ? 'none' : 'unset')};
  z-index: 13;
  transition: opacity 250ms;
  cursor: pointer;
  width: 16px;
  display: flex;
  transform: translate(75%, 50%);
  position: absolute;

  &:hover {
    opacity: ${({ loading }) => (loading ? '0.7' : '1')};
  }
`;

export const RefreshBtn = React.forwardRef(({ loading, onClick, style }, ref) => {
  return (
    <RefreshBtnContainer style={style} ref={ref} loading={String(loading)} onClick={onClick}>
      <RefreshBtnIcon />
    </RefreshBtnContainer>
  );
});

export const NoSchedulesText = styled.div`
  text-align: center;
  font-size: 1.35em;
  font-weight: bold;
`;
