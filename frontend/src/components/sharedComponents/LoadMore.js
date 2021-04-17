import { GrPowerReset } from 'react-icons/gr';
import React, { useContext, useEffect, useRef } from 'react';

import { StyledLoadmore } from '../twitch/StyledComponents';
import CountdownCircleTimer from './CountdownCircleTimer';
import { CenterContext } from '../feed/FeedsCenterContainer';

export default ({
  style = {},
  onClick,
  loaded,
  text,
  resetFunc,
  show,
  setVideosToShow,
  videosToShow,
  videos,
  showAll,
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
        <div className='button' onClick={onClickFunc}>
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
        {showAll && (
          <div className='button' onClick={showAll}>
            Show all
          </div>
        )}
        <div className='line' />
        {(setVideosToShow || resetFunc) && (
          <GrPowerReset size={20} title='Show less (reset)' id='reset' onClick={reset} />
        )}
      </StyledLoadmore>
    );
  }
  return null;
};
