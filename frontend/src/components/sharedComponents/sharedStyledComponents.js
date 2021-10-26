import { Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useContext, useImperativeHandle, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Moment from 'react-moment';
import { MdRefresh, MdAddToQueue, MdRemoveFromQueue } from 'react-icons/md';

import FeedsContext from '../feed/FeedsContext';
import CountdownCircleTimer from './CountdownCircleTimer';

export const ButtonLookalikeStyle = css`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  transition: color 250ms, background-color 250ms, border-color 250ms, box-shadow 250ms,
    opacity 250ms;
  text-transform: capitalize;
  border-radius: 5px;

  /* &:active,
  &:focus, */
  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
    border: var(--refreshButtonHoverBorder);
  }
`;

export const StyledRefreshButton = styled(Button).attrs({ variant: 'outline-secondary' })`
  ${ButtonLookalikeStyle}
  position: relative;
  left: 6px;
  align-items: center;
  margin-right: 25px;
  width: 46px;
  height: 40px;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 0;

  div[aria-label='Countdown timer'] {
    &&& {
      margin: 5px auto;
    }
  }
`;

export const RefreshButton = React.forwardRef(
  ({ children, autoRefreshEnabled, refreshTimer, parentIsLoading, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState();

    useImperativeHandle(ref, () => ({
      setIsLoading(a) {
        setIsLoading(a);
      },
    }));

    return (
      <StyledRefreshButton {...props}>
        {children}
        {autoRefreshEnabled || isLoading || parentIsLoading ? (
          <CountdownCircleTimer
            key={refreshTimer}
            isLoading={isLoading || parentIsLoading}
            autoRefreshEnabled={autoRefreshEnabled}
            startDuration={Math.max(0, Math.round((refreshTimer - Date.now()) / 1000))}
          />
        ) : (
          <MdRefresh size={32} />
        )}
      </StyledRefreshButton>
    );
  }
);

export const AddToListModalTrigger = styled(Button).attrs({ variant: 'outline-secondary' })`
  ${ButtonLookalikeStyle}
  display: flex;
  position: relative;
  font-weight: bold;
  align-items: center;
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

  .openIndividualFeed {
    position: absolute;
    left: calc(100% - 5px);
    opacity: 0;
    transition: transform 250ms cubic-bezier(0.73, 0.25, 0.18, 1) 200ms,
      opacity 200ms cubic-bezier(0.73, 0.25, 0.18, 1) 200ms,
      color 200ms cubic-bezier(0.73, 0.25, 0.18, 1) 0ms;
    transform: translateX(-115%);
    letter-spacing: unset;
    font-size: unset;
    color: rgba(200, 200, 200);
    display: flex;
    padding: 5px;

    svg {
      margin: 0;
    }
  }

  h4,
  h5 {
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

      .openIndividualFeed {
        transform: translate3d(0, calc(-100% + 5px), 0);
        opacity: 1;

        &:hover {
          color: rgba(255, 255, 255);
        }
      }
    }
  }

  span#live-indicator {
    background: rgb(202, 35, 43);
    font-weight: bold;
    border-radius: 5px;
    font-size: 0.9em;
    padding: 0px 3px;
    margin: 0 5px;
  }
`;

export const HeaderLines = styled.div`
  height: 2px;
  background-color: var(--subFeedHeaderBorder);
  width: 100%;
`;

export const HeaderOuterMainContainer = styled.div`
  width: 100%;
  margin-bottom: 5px;
  scroll-margin-top: 95px;
`;

export const HeaderTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LeftRightDivs = styled.div`
  /* align-items: end; */
  align-items: center;
  display: flex;
  position: relative;
`;

export const SubFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 400px;
  max-width: 100%;
  overflow: hidden;
`;

export const StyledVideoContainer = styled.div`
  display: grid;
  grid-template-areas:
    'video video'
    'title title'
    'info info';
  grid-template-columns: 100%;

  width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
  margin: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px;
  max-height: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
  margin-bottom: 15px;
  position: relative;
  transition: font-size 750ms, height 750ms, max-height 750ms, margin 750ms, width 750ms;
  font-size: ${({ feedVideoSizeProps }) => feedVideoSizeProps.fontSize}px;

  box-shadow: var(--videoBoxShadow);
  border-radius: 1em;
  background-color: var(--videoContainerBackgroundColor);

  &.videoFadeSlide-appear {
    opacity: 0;
    transition: opacity 750ms;
  }
  &.videoFadeSlide-appear-active {
    opacity: 1;
    transition: opacity 750ms;
  }

  &.videoFadeSlide-enter {
    opacity: 0;
    width: 0px !important;
    max-width: 0px !important;
    transform: ${({ feedVideoSizeProps }) => `translate3d(-${feedVideoSizeProps.width}px, 0, 0)`};
    margin-right: 0px !important;
    margin-left: 0px !important;
    transition: opacity 500ms, margin-left 750ms, width 750ms, margin-right 750ms, max-width 750ms,
      transform 750ms;
  }

  &.videoFadeSlide-enter-active {
    opacity: 1;
    width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px !important;
    max-width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px !important;
    transform: translate3d(0, 0, 0);
    margin-right: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
    margin-left: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
    transition: opacity 500ms, margin-left 750ms, width 750ms, margin-right 750ms, max-width 750ms,
      transform 750ms;
  }

  &.videoFadeSlide-enter-done {
    opacity: 1;
    transition: opacity 500ms;
  }

  &.videoFadeSlide-exit {
    opacity: 1;
    width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px !important;
    max-width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px !important;
    transform: translate3d(0, 0, 0);
    margin-right: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
    margin-left: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
    transition: opacity 500ms ease 250ms, margin-left 750ms, width 750ms, margin-right 750ms,
      max-width 750ms, transform 750ms;
  }

  &.videoFadeSlide-exit-active {
    opacity: 0;
    width: 0px !important;
    max-width: 0px !important;
    transform: ${({ feedVideoSizeProps }) => `translate3d(-${feedVideoSizeProps.width}px, 0, 0)`};
    margin-right: 0px !important;
    margin-left: 0px !important;
    transition: opacity 500ms ease 250ms, margin-left 750ms, width 750ms, margin-right 750ms,
      max-width 750ms, transform 750ms;
  }

  a {
    &&& {
      font-size: 1em;
    }

    .game {
      color: var(--textColor2);
    }

    &:hover {
      color: var(--textColor2Hover);
    }
  }
`;

export const VideoContainer = React.forwardRef(({ children, ...props }, ref) => {
  const { feedVideoSizeProps } = useContext(FeedsContext);

  return (
    <StyledVideoContainer feedVideoSizeProps={feedVideoSizeProps} {...props} ref={ref}>
      {children}
    </StyledVideoContainer>
  );
});

export const ImageContainer = React.forwardRef(({ children, active }, ref) => {
  const { feedVideoSizeProps } = useContext(FeedsContext);

  return (
    <StyledImageContainer feedVideoSizeProps={feedVideoSizeProps} active={active} ref={ref}>
      {children}
    </StyledImageContainer>
  );
});

export const ChannelContainer = styled.div`
  display: grid;
  height: 1.625em;
  align-content: center;
  margin-bottom: 5px;
  grid-template-columns: min-content;
  width: inherit;
  /* overflow: hidden; */
  font-size: 1em;
  z-index: 1;
  position: relative;

  .profileImg {
    grid-row: 1;
    padding-right: 5px;

    img {
      width: 1.625em;
      border-radius: 3px;
    }
  }

  .channelName {
    padding: 0 5px;
    font-weight: bold;
    color: var(--textColor2);
    grid-row: 1;
    width: max-content;
    transition: color 250ms;
    align-items: center;
  }

  .buttonsContainer {
    display: flex;
    grid-row: 1;
    justify-content: right;
    transition: transform 350ms, opacity 150ms ease-in-out 0ms;
    transform: translateY(50%);
    opacity: 0;
    pointer-events: none;
  }

  &:hover,
  &:focus-within {
    .buttonsContainer {
      transform: translateY(0px);
      opacity: 1;
      pointer-events: all;

      button,
      svg {
        opacity: 1;
      }
      transition: transform 350ms, opacity 250ms ease-in-out 100ms;
    }
  }

  a {
    display: flex;
    align-items: center;
  }
`;

export const StyledGameContainer = styled.div`
  display: grid;
  grid-template-columns: 10% auto;
  width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
  transition: width 750ms;
  align-items: center;
  /* min-height: 34px; */
  transition: color 250ms, width 750ms;
  font-size: 1em;

  .gameImg {
    width: 1.625em;
    border-radius: 3px;
    grid-column: 1;
    object-fit: cover;
    padding: 0;

    img {
      width: 100%;
      border-radius: inherit;
    }
  }

  .gameName {
    padding-left: 5px;
    grid-column: 2;
    bottom: 20px;
    background: none;
    padding-right: 5px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 250ms;
    color: var(--textColor2);
  }

  .viewers {
    color: var(--textColor2);
    position: relative;
    display: flex;
    justify-content: flex-end;
    grid-column: 3;
    padding-right: 10px;
    margin-bottom: 0;
    align-items: center;

    svg {
      color: rgb(200, 200, 200);
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
  }
`;

export const GameContainer = ({ children }) => {
  const { feedVideoSizeProps } = useContext(FeedsContext);

  return (
    <StyledGameContainer feedVideoSizeProps={feedVideoSizeProps}>{children}</StyledGameContainer>
  );
};

export const GamenameAndViewers = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  grid-column: 2;
`;

export const VideoTitle = styled(Link)`
  color: var(--textColor1);
  /* margin-top: 15px;
  margin-bottom: 5px;  */
  grid-area: title;
  font-size: 1.1em;
  max-width: 100%;
  overflow: hidden;
  /* height: 45px; */
  line-height: 1.2;
  padding: 0;
  transition: color 200ms;
  margin-top: 0.85em;
  margin-bottom: 0.3em;
  height: 2.5em;

  &:hover {
    color: var(--textColor1Hover);
    mix-blend-mode: unset;
  }
`;

// YoutubeVideoElement title
export const VideoTitleHref = styled.a`
  color: var(--textColor1);
  grid-area: title;
  font-size: 1.1em;
  max-width: 100%;
  overflow: hidden;
  line-height: 1.2;
  padding: 0;
  transition: color 200ms;
  margin-top: 0.85em;
  margin-bottom: 0.3em;
  height: 2.5em;

  &:hover {
    color: var(--textColor1Hover);
    mix-blend-mode: unset;
  }
`;

export const LatestVodBtn = styled.a`
  transition: all 500ms ease-in 0ms;
  opacity: 0;
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 1;
  color: rgb(200, 200, 200);

  &:hover {
    &&& {
      transition: color 250ms ease-in 0ms, opacity 250ms ease-in 0ms;
      color: rgb(255, 255, 255);
      opacity: 1;
    }
  }
`;

export const StyledImageContainer = styled.div`
  grid-area: video;
  height: ${({ feedVideoSizeProps }) => (feedVideoSizeProps.width / 16) * 9}px;
  width: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  transition: transform 200ms, box-shadow 200ms, font-size 750ms, height 750ms, margin 750ms,
    width 750ms;

  a {
    display: block;

    &.imgLink {
      height: 100%;
      color: var(--textColor2);
    }
  }

  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: width 750ms;
  }

  &::after {
    content: 'Playing';
    position: absolute;
    top: 0;
    padding: 3px 5px;
    border-radius: 10px;
    background: rgb(209, 3, 3) none repeat scroll 0% 0%;
    font-size: 0.8em;
    transform: translate3d(-30%, -30%, 0);
    display: ${({ active }) => (active ? 'unset' : 'none')};
  }

  &:hover {
    z-index: 2;
    transform: scale(1.15);
    box-shadow: 0 0px 0px 0px #be0e0e00, 0 0px 0px 0px #be0e0e00, 6px 0 25px -2px rgba(0, 0, 0, 0.5),
      -6px 0 25px -2px rgba(0, 0, 0, 0.5);

    .error {
      opacity: 1;
    }

    time {
      z-index: 1;
    }

    .listVideoButton {
      opacity: 1;
    }

    ${LatestVodBtn} {
      transition: opacity 250ms ease-in 1000ms, color 250ms ease-in 0ms;
      opacity: 0.7;
    }
  }
`;

export const UnfollowButton = styled(Button).attrs({ variant: 'link' })`
  color: rgba(109, 2, 2, 0.801);
  grid-row: 1;
  justify-self: right;
  width: 36px;
  padding-left: 0;
  padding: 2px;

  &:hover {
    color: rgba(203, 14, 14, 0.8);
  }
`;

export const VodAddRemoveButton = styled(Button)`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  padding: ${({ padding }) => padding || '0px'};
  opacity: ${({ loweropacity }) => loweropacity || 1};
  margin-right: ${({ marginright }) => marginright || 'unset'};
  /* opacity: 0; */
  transition: opacity 250ms, background 250ms, color 250ms, transform 250ms;
  z-index: 2;

  &&& {
    &:hover {
      color: ${({ vodenabled, variant }) =>
        variant === 'success' ? 'unset' : vodenabled === 'true' ? 'rgb(225, 000, 000)' : '#14ae14'};
      opacity: 1;
    }
  }
`;

const breathing = keyframes`
    from {
      color: var(--textColor1);
    }
    to {
      color: var(--textColor2);
    }
`;

export const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  justify-items: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
    animation: 2s infinite alternate ease-out ${breathing};
  }
  p {
    color: var(--textColor2);
  }
`;

export const ImgBottomInfo = styled.div`
  bottom: 2.2em;
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  align-items: center;
  height: 2em;
  margin: 0px 0.2em 0px 0.2em;

  > * {
    position: relative;
    width: max-content;
    /* font-size: 0.9em; */
    z-index: 1;
    background: rgba(22, 22, 22, 0.69);
    align-items: center;
    display: flex;
    border-radius: 1em;
    padding: 0.2em 0.5em;

    /* bottom: 2.2em; */
    /* height: 2em; */
  }

  .view_count svg {
    color: var(--textColor2);
    margin-left: 5px;
    margin-top: 3px;
    display: flex;
    align-items: center;
  }
`;

export const StyledVideoElementAlert = styled(Alert)`
  text-align: center;
  padding: 2px;
  position: absolute;
  width: 100%;
  border-radius: 10px 10px 0 0;
  transition: opacity 250ms;
  opacity: 0;
`;

export const StyledAlert = styled(Alert)`
  text-align: center;
  width: 86%;
  margin: auto;
  margin-top: 50px;
  opacity: 0.7;
`;

export const LastRefreshText = styled(Moment).attrs({ fromNow: true, interval: 60000 })`
  position: relative;
  color: var(--textColor2);
`;

export const TransparentButton = styled.button`
  &&& {
    background: transparent;
    border: none;
    color: none;
    display: flex;

    &:hover,
    &:active,
    &:focus {
      background: none;
      border: none;
      color: none;
    }
  }
`;

export const AddToQueueButton = styled(MdAddToQueue)`
  position: absolute;
  top: 5px;
  left: 5px;

  cursor: pointer;
  opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.5')};
  transition: opacity 250ms;

  &:hover {
    opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.7')};
  }
`;
export const RemoveFromQueueButton = styled(MdRemoveFromQueue)`
  position: absolute;
  top: 5px;
  left: 5px;
  cursor: pointer;
  opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.5')};
  transition: opacity 250ms;

  &:hover {
    opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.7')};
  }
`;

export const PositionInQueue = styled.div`
  position: absolute;
  top: 5px;
  left: 35px;
`;

export const ExpandSection = styled.div`
  transition: height 500ms;
  overflow: hidden;
  height: ${({ height, expanded }) => (expanded === 'true' ? height : 0)}px;
  padding: 5px;
  overflow: ${({ expanded }) => (expanded === 'true' ? 'visible' : 'hidden')};

  &.ListForm-appear {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-appear-active {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-appear-done {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter-done {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-enter-active {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit-active {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.ListForm-exit-done {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }
`;
