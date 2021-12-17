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
        loaded={true}
        setVideosToShow={setVodAmounts}
        videosToShow={vodAmounts}
        videos={videos}
      />
    </>
  );
};

export default YoutubeHandler;
