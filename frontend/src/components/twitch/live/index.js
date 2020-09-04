import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';

import StreamEle from './StreamElement.js';
import { Container } from '../StyledComponents';
import LoadingBoxes from '../LoadingBoxes';
import AlertHandler from './../../alert';

export default ({ data, videoElementsAmount }) => {
  const refresh = async () => {
    await data.refresh();
  };

  if (!data.loaded) {
    return (
      <Container>
        <LoadingBoxes amount={videoElementsAmount || 4} />
      </Container>
    );
  } else if (data.error) {
    return (
      <AlertHandler
        type='secondary'
        title={data.error}
        style={{
          width: '50%',
        }}
      />
    );
  }

  return (
    <Container>
      <TransitionGroup component={null}>
        {data?.liveStreams?.map((stream) => {
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
                data={stream}
                newlyAddedStreams={data.newlyAddedStreams}
                newlyAdded={stream.newlyAdded}
                refresh={refresh}
                REFRESH_RATE={data.REFRESH_RATE}
                refreshAfterUnfollowTimer={data.refreshAfterUnfollowTimer}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      <AlertHandler
        show={!Boolean(data?.liveStreams?.length)}
        type='secondary'
        title='No streams online at the momment'
        style={{
          width: '50%',
        }}
      />
    </Container>
  );
};
