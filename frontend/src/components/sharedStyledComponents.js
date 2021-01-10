import { Button, Alert } from 'react-bootstrap';
import { GrPowerReset } from 'react-icons/gr';
import { Link, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdRefresh, MdVideoLabel } from 'react-icons/md';
import { FaRegWindowRestore } from 'react-icons/fa';
import Moment from 'react-moment';

import { StyledLoadmore } from './twitch/StyledComponents';
import CountdownCircleTimer from './twitch/live/CountdownCircleTimer';
import { CenterContext } from './feed/FeedsCenterContainer';
import FeedsContext from './feed/FeedsContext';

const RefreshButton = styled(Button).attrs({ variant: 'outline-secondary' })`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  position: relative;
  left: 6px;
  align-items: center;
  transition-duration: 250ms;
  transition: color 250ms, background-color 250ms, border-color 250ms, box-shadow 250ms,
    opacity 250ms;
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

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
    border: var(--refreshButtonHoverBorder);
  }
`;

export const ButtonList = styled(Button).attrs({ variant: 'outline-secondary' })`
  display: flex;
  position: relative;
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  font-weight: bold;
  align-items: center;
  transition-duration: 250ms;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
    border: var(--refreshButtonHoverBorder);
  }
`;

const HeaderTitle = styled.div`
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
    transition: transform 250ms ease-in-out 200ms, opacity 200ms ease-in-out 200ms,
      color 200ms ease-in-out 0ms;
    opacity: 0;
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
    color: var(--textColor2);
    margin: auto;
    letter-spacing: 1px;
    margin: 2px auto;
    display: flex;
    margin: 0 10px;
    font-size: 1.3rem;
    transition: margin 500ms, color 500ms;
    align-items: center;
    min-width: max-content;

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

const HeaderLines = styled.div`
  height: 2px;
  background-color: var(--subFeedHeaderBorder);
  width: 100%;
`;

const HeaderOuterMainContainer = styled.div`
  width: 100%;
  margin-bottom: 5px;
  padding-top: 20px;
`;

const HeaderTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftRightDivs = styled.div`
  align-items: end;
  display: flex;
`;

export const HeaderContainer = (props) => {
  const {
    children,
    text,
    onHoverIconLink,
    id,
    leftSide,
    rightSide,
    isLoading,
    autoRefreshEnabled,
    refreshFunc,
    refreshTimer,
    style = {},
  } = props;
  const ref = useRef();
  const path = useLocation().pathname.replace('/', '');

  const handleOnClick = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  return (
    <HeaderOuterMainContainer ref={ref} style={style} id={id}>
      <HeaderTopContainer>
        <LeftRightDivs>
          {refreshFunc && (
            <RefreshButton disabled={isLoading} onClick={refreshFunc}>
              {autoRefreshEnabled || isLoading ? (
                <CountdownCircleTimer
                  key={refreshTimer}
                  isLoading={isLoading}
                  autoRefreshEnabled={autoRefreshEnabled}
                  startDuration={Math.max(0, Math.round((refreshTimer - Date.now()) / 1000))}
                />
              ) : (
                <MdRefresh size={32} />
              )}
            </RefreshButton>
          )}
          {leftSide}
        </LeftRightDivs>
        {children}
        <LeftRightDivs>{rightSide}</LeftRightDivs>
      </HeaderTopContainer>
      <HeaderTitle>
        <HeaderLines />
        <h5 onClick={handleOnClick}>
          {text}
          {onHoverIconLink && onHoverIconLink !== path && (
            <Link
              to={`/${onHoverIconLink}`}
              className='openIndividualFeed'
              title={`Link to ${text.props.children[0].trim()} individual feed page.`}
            >
              <FaRegWindowRestore size={18} />
            </Link>
          )}
        </h5>
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
};

export const SubFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 400px;
  max-width: 100%;
`;

export const StyledVideoContainer = styled.div`
  display: grid;
  grid-template-areas:
    'video video'
    'title title'
    'info info';

  width: ${({ feedSizesObj }) => feedSizesObj.width}px;
  margin: ${({ feedSizesObj }) => feedSizesObj.margin}px;
  max-height: ${({ feedSizesObj }) => feedSizesObj.width}px;
  margin-bottom: 15px;
  position: relative;
  transition: font-size 750ms, height 750ms, max-height 750ms, margin 750ms, width 750ms;
  font-size: ${({ feedSizesObj }) => feedSizesObj.fontSize}px;

  box-shadow: var(--videoBoxShadow);
  border-radius: 10px;
  background-color: var(--videoContainerBackgroundColor);

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

export const VideoContainer = ({ children, ...props }) => {
  const { feedSize, feedSizesObj } = useContext(FeedsContext);

  return (
    <StyledVideoContainer feedSize={feedSize} feedSizesObj={feedSizesObj} {...props}>
      {children}
    </StyledVideoContainer>
  );
};

export const ImageContainer = React.forwardRef(({ children }, ref) => {
  const { feedSizesObj } = useContext(FeedsContext);

  return (
    <StyledImageContainer feedSizesObj={feedSizesObj} ref={ref}>
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

  &:hover {
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
  width: ${({ feedSizesObj }) => feedSizesObj.width}px;
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
  const { feedSizesObj } = useContext(FeedsContext);

  return <StyledGameContainer feedSizesObj={feedSizesObj}>{children}</StyledGameContainer>;
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

export const StyledImageContainer = styled.div`
  grid-area: video;
  height: ${({ feedSizesObj }) => (feedSizesObj.width / 16) * 9}px;
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
  }

  .duration {
    position: relative;
    width: max-content;
    padding-right: 5px;
    font-size: 0.9em;
    padding-left: 5px;
    z-index: 1;
    height: 24px;
    bottom: 28px;
    left: 4px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    background: #161616b0;
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

export const VodAddRemoveButton = styled(Button).attrs({ variant: 'link' })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  padding: 0px;
  opacity: ${({ loweropacity }) => loweropacity || 1};
  margin-right: ${({ marginright }) => marginright || 'unset'};
  opacity: 0;
  transition: opacity 250ms, transform 250ms;

  &:hover {
    color: ${({ vodenabled }) => (vodenabled === 'true' ? 'rgb(225, 000, 000)' : '#14ae14')};
    opacity: 1;
  }
`;

export const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
  }
`;

export const VodVideoInfo = styled.div`
  bottom: 28px;
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  align-items: center;

  .view_count {
    width: max-content;
    padding-right: 5px;
    padding-left: 5px;
    background: #161616b0;
    margin: 0;
    margin-right: 3px;
    border-radius: 10px;
    height: 24px;
    display: flex;
    align-items: center;

    svg {
      color: var(--textColor2);
      margin-left: 5px;
      margin-top: 3px;
      display: flex;
      align-items: center;
    }
  }
`;

export const StyledVideoElementAlert = styled(Alert)`
  text-align: center;
  padding: 3px;
  position: absolute;
  width: 100%;
  border-radius: 10px 10px 0 0;
  transition: opacity 250ms;
  opacity: 0;
`;

export const LoadMore = ({
  style = {},
  onClick,
  loaded,
  text,
  resetFunc,
  show,
  setVideosToShow,
  videosToShow,
  videos,
}) => {
  const thisEleRef = useRef();
  const { videoElementsAmount } = useContext(CenterContext) || {};
  const resetTransitionTimer = useRef();

  const reset = () => {
    if (resetFunc) {
      resetFunc();
    } else if (setVideosToShow && videoElementsAmount) {
      setVideosToShow({
        amount: videoElementsAmount,
        timeout: 0,
        transitionGroup: 'instant-disappear',
      });
      clearTimeout(resetTransitionTimer.current);
      resetTransitionTimer.current = setTimeout(() => {
        setVideosToShow({
          amount: videoElementsAmount,
          timeout: 750,
          transitionGroup: 'videos',
        });
      }, 750);
    }
  };

  const onClickFunc = () => {
    observer.current.observe(thisEleRef.current);
    if (onClick) {
      onClick();
    } else {
      if (videosToShow.amount >= videos?.length) {
        reset();
      } else {
        setVideosToShow((curr) => ({
          amount: curr.amount + videoElementsAmount,
          timeout: 750,
          transitionGroup: 'videos',
        }));
      }
    }
  };

  const observer = useRef(
    new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting === false) {
          // setTimeout(() => {
          if (thisEleRef.current) {
            thisEleRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest',
            });
            observer.current.unobserve(thisEleRef.current);
          }
          // }, 0);
        }
      },
      { threshold: 0.8 }
    )
  );

  useEffect(() => {
    if (Boolean(show || videos?.length > videoElementsAmount)) {
      const thisEle = thisEleRef.current;
      const observerRef = observer.curren;
      return () => {
        return observerRef?.unobserve(thisEle);
      };
    }
  }, [show, videos, videoElementsAmount]);

  if (Boolean(show || videos?.length > videoElementsAmount)) {
    return (
      <StyledLoadmore ref={thisEleRef} style={style} size={18}>
        <div className='line' />
        <div id='Button' onClick={onClickFunc}>
          {!loaded ? (
            <>
              Loading..
              <CountdownCircleTimer isLoading={true} style={{ marginLeft: '10px' }} size={18} />
            </>
          ) : (
            text ||
            (videosToShow.amount >= videos?.length ? 'Show less (reset)' : 'Show more') ||
            'Load more'
          )}
        </div>
        <div className='line' />
        {(setVideosToShow || resetFunc) && (
          <GrPowerReset size={20} title='Show less (reset)' id='reset' onClick={reset} />
        )}
      </StyledLoadmore>
    );
  }
  return null;
};

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

export const Duration = styled.div`
  position: relative;
  height: 24px;
  width: max-content;
  z-index: 1;
  align-items: center;
  display: flex;
  border-radius: 10px;
  padding-right: 5px;
  padding-left: 5px;
  background: rgba(22, 22, 22, 0.69);
  font-size: 0.9em;
  margin: 0px 0px 0px 5px;
  bottom: ${({ bottom }) => bottom || '0px'};
`;

export const FeedSizeBtn = styled.div`
  position: absolute;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: -40px;
  background: var(--refreshButtonBackground);
  padding: 5px;
  border-radius: 2px;
`;

export const FeedSizeIcon = styled(MdVideoLabel)`
  fill: ${({ active }) => (active === 'true' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)')};
  cursor: pointer;
  margin: 5px 0;
  transition: fill 500ms;
  z-index: 1;

  &:hover {
    fill: ${({ active }) => (active === 'true' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.75)')};
  }
`;
