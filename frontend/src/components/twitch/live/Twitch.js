import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useContext } from 'react';

import StreamEle from './StreamElement.js';
import { Container } from '../StyledComponents';
import LoadingBoxes from '../LoadingBoxes';
import AlertHandler from './../../alert';
import { CenterContext } from '../../feed/FeedsCenterContainer.js';

export default ({ data }) => {
  const {
    loaded,
    lastLoaded,
    error,
    liveStreams,
    thumbnailRefresh,
    newlyAddedStreams,
    REFRESH_RATE,
    refreshAfterUnfollowTimer,
  } = data;
  const { videoElementsAmount } = useContext(CenterContext);

  const refresh = async () => await data.refresh();

  if (!loaded) {
    return (
      <Container>
        <LoadingBoxes amount={videoElementsAmount || 4} type='big' />
      </Container>
    );
  } else if (error) {
    return (
      <AlertHandler
        type='secondary'
        title={error}
        style={{
          width: '50%',
        }}
      />
    );
  }

  return (
    <Container>
      <TransitionGroup component={null}>
        {liveStreams?.map((stream) => {
          return (
            <CSSTransition
              key={stream.user_id}
              timeout={750}
              classNames='videoFadeSlide'
              unmountOnExit
              appear
            >
              <StreamEle
                key={stream.id}
                lastLoaded={lastLoaded}
                thumbnailRefresh={thumbnailRefresh}
                data={stream}
                newlyAddedStreams={newlyAddedStreams}
                newlyAdded={stream.newlyAdded}
                refresh={refresh}
                REFRESH_RATE={REFRESH_RATE}
                refreshAfterUnfollowTimer={refreshAfterUnfollowTimer}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      <AlertHandler
        show={!Boolean(liveStreams?.length)}
        type='secondary'
        title='No streams online at the momment'
        hideMessage={true}
        style={{
          width: '50%',
        }}
        dismissible={true}
      />
    </Container>
  );
};
