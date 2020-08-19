import styled, { css, keyframes } from 'styled-components';
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';

export const StyledLoadmore = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto min-content auto min-content;
  align-items: center;
  max-width: 100%;
  padding-bottom: 10px;

  &:hover {
    div:not(#Button) {
      opacity: 1;
      transition: opacity 200ms;
    }
  }

  div:not(#Button) {
    background: var(--subFeedHeaderBorder);
    height: 1px;
    opacity: 0.75;
    transition: opacity 200ms;
  }

  div#Button {
    width: max-content;
    cursor: pointer;
    margin: 0;
    font-weight: bold;
    /* color: #a4a4a4; */
    color: var(--textColor2);
    /* text-shadow: 0px 0px 5px black; */
    padding: 0px 15px;
    transition: color 200ms, padding 200ms;

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
  height: 24px;
  width: 24px;
  /* text-align: center;
  margin: 5px auto !important; */

  div#countdown-number {
    display: inline-block;
    line-height: 24px;
    width: 24px;
    height: 24px;
    /* color: rgb(255, 255, 255); */
    font-size: 12px;
    display: flex;
    justify-content: center;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    animation: ${({ isLoading }) => isLoading && spinnigAnimation};
  }

  svg circle {
    stroke-dasharray: ${({ isLoading }) => (isLoading ? '47.8px' : '67.8px')};
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
  /* 0% {background: #131416d1;} */
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
  grid-template-areas: "video video" "title title" "info info";
  width: 336px;
  margin: 7px;
  max-height: 336px;
  margin-bottom: 15px;
  /* height: ${({ type }) => (type === 'Vods' || type === 'Clips' ? 'unset' : '334px')}; */
  height: unset;

  transition: all 1s linear;

  div#video {
    grid-area: video;
    max-height: 189px;
    min-height: 189px;
    width: 336px;
    border-radius: 10px;
    background: #121415d1;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);
  }

  div div {
    background: #121415d1;
    border-radius: 10px;
  }

  div#title {
    color:var(--textColor1);
    margin-top: 15px;
    margin-bottom: 5px;
    grid-area: title;
    font-size: 1.1rem;
    max-width: 336px;
    overflow: hidden;
    height: 45px;
    line-height: 1.2;

    div {
      animation: ${pulse} 2s linear infinite;
      width: 260px;
      height: 24px;
      margin-top: 5px;
      border-radius: 12px;
      transform: translate3d(0, 0, 0);
    }
  }

  #details {
    height: ${({ type }) => (type === 'Vods' ? '65px' : type === 'Clips' ? '25px' : '75px')};
    /* height: 65px; */

    #channel {
      animation: ${pulse} 2s linear infinite;
      width: 100px;
      /* height: 20px; */
      height: ${({ type }) => (type === 'Clips' ? '25px' : '20px')};
      /* margin: 7px 0; */
      margin: ${({ type }) => (type === 'Clips' ? '0' : '7px 0')};
      transform: translate3d(0, 0, 0);
    }

    #game {
      animation: ${pulse} 2s linear infinite;
      width: 125px;
      height: 20px;
      margin: 21px 0 0 0;
      display: ${({ type }) => (type === 'Clips' ? 'none' : 'block')};
      transform: translate3d(0, 0, 0);
    }
  }
`;

export const StyledLoadingList = styled.ul`
  li div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
    transform: translate3d(0, 0, 0);
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

  .channelName {
    z-index: 1;
  }

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
  padding-bottom: 50px;
  min-height: 400px;
  /* min-height: 475px; */
`;

export const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  transition: width 750ms, margin 750ms;
  /* margin-left: ${({ marginLeft }) => marginLeft + 'px'}; */

  margin-left: ${({
    enableTwitter,
    enableTwitch,
    showTwitchSidebar,
    twitterWidth,
    centerWidth,
    twitchSidebarWidth,
  }) =>
    !enableTwitter && (!enableTwitch || !showTwitchSidebar)
      ? 'auto'
      : (window.innerWidth - (twitchSidebarWidth + twitterWidth + centerWidth + 50)) /
          // (enableTwitter ? twitterWidth + 25 + centerWidth : centerWidth + 50))) /
          // : 350 * Math.floor((window.innerWidth - (twitchSidebarWidth + 150)) / 350) + 50))) /
          2 +
        twitchSidebarWidth +
        'px'};
  margin-right: ${({ enableTwitter, enableTwitch, showTwitchSidebar }) =>
    !enableTwitter && (!enableTwitch || !showTwitchSidebar) ? 'auto' : 'unset'};
  width: ${({ centerWidth }) => centerWidth}px !important;

`;
