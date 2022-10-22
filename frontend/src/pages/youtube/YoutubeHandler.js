import { TransitionGroup, CSSTransition } from 'react-transition-group';
import React, { useState, useEffect, useContext } from 'react';

import LoadMore from '../../components/loadMore/LoadMore';
import { SubFeedContainer } from './../sharedComponents/sharedStyledComponents';
import YoutubeVideoElement from './YoutubeVideoElement';
import LoadingBoxes from './../twitch/LoadingBoxes';
import { CenterContext } from '../feed/FeedsCenterContainer';

const YoutubeHandler = ({ requestError, videos }) => {
  const { videoElementsAmount, feedVideoSizeProps } = useContext(CenterContext);
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
  }, [videoElementsAmount]);

  if (requestError?.code === 401 && !videos) {
    return '';
  } else if (!videos || !Boolean(videos?.length)) {
    return (
      <SubFeedContainer>
        <LoadingBoxes amount={videoElementsAmount} type='small' />
      </SubFeedContainer>
    );
  }
  return (
    <>
      <TransitionGroup
        className={vodAmounts.transitionGroup || 'videos'}
        component={SubFeedContainer}
      >
        {videos.slice(0, vodAmounts.amount).map((video, index) => (
          <CSSTransition
            timeout={vodAmounts.timeout}
            classNames={
              index < videoElementsAmount
                ? feedVideoSizeProps.transition || 'videoFadeSlide'
                : 'fade-750ms'
            }
            key={video?.contentDetails?.upload?.videoId}
            unmountOnExit
          >
            <YoutubeVideoElement video={video} />
          </CSSTransition>
        ))}
      </TransitionGroup>

      <LoadMore
        onClick={() => {
          setVodAmounts((curr) => ({
            amount: curr.amount + videoElementsAmount,
            timeout: 750,
            transitionGroup: 'videos',
          }));
        }}
        onReset={() => {
          setVodAmounts((curr) => ({
            amount: videoElementsAmount,
            timeout: 750,
            transitionGroup: 'videos',
            //transitionGroup: 'instant-disappear',
          }));
          /*clearTimeout(resetTransitionTimer.current);
            resetTransitionTimer.current = setTimeout(() => {
              setVideosToShow((curr) => ({
                amount: curr.amount,
                timeout: 750,
                transitionGroup: 'videos',
              }));
            }, 750);*/
        }}
        reachedEnd={vodAmounts?.amount >= videos?.length}
        onShowAll={() => {
          setVodAmounts({
            amount: videos?.length,
            timeout: 750,
            transitionGroup: 'videos',
            showAll: true,
          });
        }}
      />
    </>
  );
};

export default YoutubeHandler;
