import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import { feedVideoSizeAtom, feedVideoSizePropsAtom } from '../../atoms/atoms';

export const pulseOpacity = keyframes`
  0% {opacity 1;}
  50% {opacity 0;}
  100% {opacity 1;}
`;

export const pulse = keyframes`
  0% {background: var(--navigationbarBackground);}
  40% {background: #1d1e23d1;}
  100% {background: var(--navigationbarBackground);}
`;

export const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

export const pulseAnimation = () => css`
  ${pulse} 2s linear infinite;
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
    background: var(--navigationbarBackground);
    animation: ${({ freeze }) => freeze || pulseAnimation};
  }

  div div {
    background: var(--navigationbarBackground);
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
      animation: ${({ freeze }) => freeze || pulseAnimation};
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
      animation: ${({ freeze }) => freeze || pulseAnimation};
      width: 100px;
      height: ${({ type }) => (type === 'big' ? '1.5em' : '25px')};
      margin: ${({ type }) => (type === 'big' ? '7px 0' : '0')};
    }

    #game {
      animation: ${({ freeze }) => freeze || pulseAnimation};
      width: 125px;
      height: 1.5em;
      /* margin: 21px 0 0 0; */
      display: ${({ type }) => (type === 'big' ? 'block' : 'none')};
    }
  }
`;

export const LoadingVideoElement = ({ type, freeze }) => {
  const feedSize = useRecoilValue(feedVideoSizeAtom);
  const feedVideoSizeProps = useRecoilValue(feedVideoSizePropsAtom);

  return (
    <StyledLoadingBox
      type={type}
      feedSize={feedSize}
      feedVideoSizeProps={feedVideoSizeProps}
      freeze={freeze}
    >
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

export const Container = styled.section`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  /* min-height: ${({ collapsed }) => (collapsed ? 0 : 307)}px; */
  margin-bottom: 20px;
  width: 100%;
  order: ${({ order }) => order};
`;

export const CenterContainer = styled.div`
  &&& {
    max-width: 100%;

    width: 100%;
    margin: 0;
    display: grid;
    grid-template-areas: 'twitchsidebar feed twitter';
    grid-template-columns: ${({ left }) => left || 0}px ${({ centerWidth }) =>
        centerWidth ? centerWidth + 'px' : 'auto'} ${({ right }) => right || 0}px;
    /* padding-top: 25px; */
    justify-content: center;
    gap: 25px;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }

  .feed,
  #feed {
    grid-area: feed;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    position: relative;
  }
`;

export const FavoriteDeviderLine = styled.div`
  /* background: #bcbc1d; */
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-evenly;
  flex-direction: column;
  width: 3px;
  align-items: center;
  margin: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px;
  margin-right: 0;
  margin-left: 0;
  margin-bottom: 15px;

  div {
    background: #8888885e;
    height: 50%;
    width: 100%;
    border-radius: 1.5px;
  }

  svg {
    margin: 10px 0;
  }
`;
