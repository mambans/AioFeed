import { TransitionGroup, CSSTransition } from 'react-transition-group';
import React, { useRef, useState, useEffect } from 'react';

import { SubFeedContainer, LoadMore } from './../sharedStyledComponents';
import YoutubeVideoElement from './YoutubeVideoElement';
import LoadingBoxes from './../twitch/LoadingBoxes';

export default ({ requestError, videos, videoElementsAmount }) => {
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });
  const resetTransitionTimer = useRef();

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
  }, [videoElementsAmount]);

  if (requestError && requestError.code === 401 && !videos) {
    return '';
  } else if (!videos || videos.length < 1) {
    return <LoadingBoxes amount={videoElementsAmount} type='Vods' />;
  } else {
    return (
      <>
        <TransitionGroup
          className={vodAmounts.transitionGroup || 'videos'}
          component={SubFeedContainer}
        >
          {videos.slice(0, vodAmounts.amount).map((video, index) => {
            return (
              <CSSTransition
                timeout={vodAmounts.timeout}
                classNames={index < videoElementsAmount ? 'videoFadeSlide' : 'fade-750ms'}
                key={video.contentDetails.upload.videoId}
                unmountOnExit
              >
                <YoutubeVideoElement id={video.contentDetails.upload.videoId} video={video} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>

        <LoadMore
          loaded={true}
          text={vodAmounts.amount >= videos.length ? 'Show less (reset)' : 'Show more'}
          onClick={() => {
            if (vodAmounts.amount >= videos.length) {
              setVodAmounts({
                amount: videoElementsAmount,
                timeout: 0,
                transitionGroup: 'instant-disappear',
              });

              clearTimeout(resetTransitionTimer.current);
              resetTransitionTimer.current = setTimeout(() => {
                setVodAmounts({
                  amount: videoElementsAmount,
                  timeout: 750,
                  transitionGroup: 'videos',
                });
              }, 750);
            } else {
              setVodAmounts((curr) => ({
                amount: curr.amount + videoElementsAmount,
                transition: 'fade-750ms',
                timeout: 750,
                transitionGroup: 'videos',
              }));
            }
          }}
          resetFunc={() => {
            setVodAmounts({
              amount: videoElementsAmount,
              timeout: 0,
              transitionGroup: 'instant-disappear',
            });
            clearTimeout(resetTransitionTimer.current);
            resetTransitionTimer.current = setTimeout(() => {
              setVodAmounts({
                amount: videoElementsAmount,
                timeout: 750,
                transitionGroup: 'videos',
              });
            }, 750);
          }}
        />
      </>
    );
  }
};
