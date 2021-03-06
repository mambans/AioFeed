import React, { useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import FeedsContext from '../feed/FeedsContext';

export const StyledLoadmore = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  max-width: 100%;
  padding-bottom: 10px;

  &:hover {
    div:not(.button) {
      opacity: 1;
      transition: opacity 200ms;
    }
  }

  div:not(.button).line {
    background: var(--subFeedHeaderBorder);
    height: 1px;
    opacity: 0.75;
    transition: opacity 200ms;
    flex-grow: 1;
  }

  div.button {
    display: flex;
    width: max-content;
    cursor: pointer;
    margin: 0;
    font-weight: bold;
    color: var(--textColor2);
    padding: 0px 15px;
    transition: color 200ms, padding 200ms;
    white-space: nowrap;

    &:hover {
      color: white;
      padding: 0px 25px;
    }
  }

  #reset {
    cursor: pointer;
    color: var(--textColor2);
    margin-left: 5px;
    transition: color 200ms, margin 200ms, stroke 200ms;

    path {
      transition: stroke 200ms;
      stroke: var(--textColor2);
    }

    &:hover {
      color: white;
      margin-left: 10px;

      path {
        stroke: white;
      }
    }
  }
`;

const InfinitSpinnig = keyframes`
0% {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
`;

const spinnigAnimation = () => css`
  ${InfinitSpinnig} 1s infinite;
`;

const countdown = keyframes`
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 67.8px;
    }
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

export const pulse = keyframes`
  0% {background: #121415d1;}
  40% {background: #1d1e23d1;}
  100% {background: #121415d1;}
`;

export const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

export const StyledLoadingBox = styled.div`
  display: grid;
  grid-template-areas: 'video video' 'title title' 'info info';
  width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width || 336}px;
  margin: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin || 7}px;
  max-height: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width || 336}px;
  font-size: ${({ feedVideoSizeProps }) => feedVideoSizeProps.fontSize || 16}px;
  grid-template-columns: 100%;
  height: unset;
  transform-origin: left top;
  transition: all 1s linear;
  margin-bottom: 15px;

  div#video {
    grid-area: video;
    max-height: ${({ feedVideoSizeProps }) => ((feedVideoSizeProps.width || 336) / 16) * 9}px;
    min-height: ${({ feedVideoSizeProps }) => ((feedVideoSizeProps.width || 336) / 16) * 9}px;
    width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width || 336}px;
    border-radius: 1em;
    background: #121415d1;
    animation: ${pulse} 2s linear infinite;
  }

  div div {
    background: #121415d1;
    border-radius: 1em;
  }

  div#title {
    color: var(--textColor1);
    margin-top: 0.75em;
    margin-bottom: 0.5em;
    grid-area: title;
    /* font-size: 1.1rem; */
    /* max-width: 336px; */
    max-width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width || 336}px;
    overflow: hidden;
    height: 2.5em;
    line-height: 1.2;

    div {
      animation: ${pulse} 2s linear infinite;
      width: 80%;
      /* width: 260px; */
      height: 1.5em;
      margin-top: 5px;
      border-radius: 10px;
    }
  }

  #details {
    height: ${({ type }) => (type === 'small' ? '25px' : type === 'big' ? '5em' : '75px')};

    #channel {
      animation: ${pulse} 2s linear infinite;
      width: 100px;
      height: ${({ type }) => (type === 'big' ? '1.5em' : '25px')};
      margin: ${({ type }) => (type === 'big' ? '7px 0' : '0')};
    }

    #game {
      animation: ${pulse} 2s linear infinite;
      width: 125px;
      height: 1.5em;
      /* margin: 21px 0 0 0; */
      display: ${({ type }) => (type === 'big' ? 'block' : 'none')};
    }
  }
`;

export const LoadingVideoElement = ({ type }) => {
  const { feedSize, feedVideoSizeProps } = useContext(FeedsContext);

  return (
    <StyledLoadingBox type={type} feedSize={feedSize} feedVideoSizeProps={feedVideoSizeProps}>
      <div id='video'></div>
      <div id='title'>
        <div></div>
      </div>
      <div id='details'>
        <div id='channel'></div>
        <div id='game'></div>
      </div>
    </StyledLoadingBox>
  );
};

export const StyledLoadingList = styled.ul`
  li div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
  }
`;

export const FollowBtn = styled(MdFavoriteBorder)`
  cursor: pointer;
  color: red;
  transition: color 250ms, opacity 250ms;
  margin: 0 10px;
  opacity: 0;

  &:hover {
    color: green;
    opacity: 1;
  }
`;

export const UnfollowBtn = styled(MdFavorite)`
  cursor: pointer;
  color: green;
  transition: color 250ms, opacity 250ms;
  margin: 0 10px;
  opacity: 0;

  &:hover {
    color: red;
    opacity: 1;
  }
`;

export const ChannelNameDiv = styled.div`
  padding-right: 5px;
  font-weight: 700;
  height: 100%;
  grid-row: 1;
  display: flex;
  transition: color 250ms;
  width: max-content;

  /* .channelName {
    z-index: 1;
  } */

  .extaButton {
    grid-row: 1;
    color: #710271;
    padding: 0px 10px;
    opacity: 0;
    transition: opacity 250ms, transform 250ms;
    transform: translateX(-25px);

    &:hover {
      color: #af2caf;
      opacity: 1;
    }
  }

  &:hover {
    .extaButton {
      transform: translateX(0px);
      opacity: 1;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  min-height: 307px;
  margin-bottom: 50px;
  width: 100%;
  order: ${({ order }) => order};
`;

export const CenterContainer = styled.div`
  &&& {
    width: ${({ centerWidth }) => centerWidth}px;
    max-width: 100%;
  }

  display: flex;
  justify-content: center;
  flex-flow: column;
  transition: width 750ms, margin 750ms;
  position: relative;

  margin-left: ${({
    enableTwitter,
    enableTwitch,
    showTwitchSidebar,
    twitterWidth,
    centerWidth,
    twitchSidebarWidth,
    winWidth,
    fullWidth,
  }) =>
    fullWidth || (!enableTwitter && (!enableTwitch || !showTwitchSidebar))
      ? 'auto'
      : (winWidth - (twitchSidebarWidth + twitterWidth + centerWidth)) / 2 +
        twitchSidebarWidth +
        'px'};
  margin-right: ${({ enableTwitter, enableTwitch, showTwitchSidebar, fullWidth }) =>
    fullWidth || (!enableTwitter && (!enableTwitch || !showTwitchSidebar)) ? 'auto' : 'unset'};
`;
