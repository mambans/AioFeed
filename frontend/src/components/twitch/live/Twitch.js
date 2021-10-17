import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useContext } from 'react';
import { MdStar } from 'react-icons/md';

import StreamEle from './StreamElement.js';
import { Container, FavoriteDeviderLine } from '../StyledComponents';
import LoadingBoxes from '../LoadingBoxes';
import AlertHandler from './../../alert';
import { CenterContext } from '../../feed/FeedsCenterContainer.js';
import VodsContext from '../vods/VodsContext.js';

const Twitch = ({ data }) => {
  const { loaded, error, liveStreams, newlyAddedStreams, refreshAfterUnfollowTimer } = data;
  const { videoElementsAmount, feedVideoSizeProps } = useContext(CenterContext);
  const { favStreams } = useContext(VodsContext);

  const favoriteStreams = liveStreams.filter((c) =>
    favStreams?.includes(c.user_name?.toLowerCase())
  );
  const nonFavoriteStreams = liveStreams.filter(
    (c) => !favStreams?.includes(c.user_name?.toLowerCase())
  );

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

  const streamEleAttrs = {
    refreshAfterUnfollowTimer,
    refresh,
    newlyAddedStreams,
  };

  const cssTransitionAttrs = {
    timeout: 750,
    unmountOnExit: true,
    appear: true,
  };

  return (
    <Container style={{ margin: '0' }}>
      <TransitionGroup component={null}>
        {favoriteStreams?.map((stream) => (
          <CSSTransition
            key={stream.user_id}
            classNames={feedVideoSizeProps.transition || 'videoFadeSlide'}
            {...cssTransitionAttrs}
          >
            <StreamEle
              key={stream.id}
              data={stream}
              newlyAdded={stream.newlyAdded}
              {...streamEleAttrs}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {Boolean(favoriteStreams?.length) && (
        <FavoriteDeviderLine feedVideoSizeProps={feedVideoSizeProps}>
          <div />
          <MdStar size={16} color={'#bcbc1d'} />
          <div />
        </FavoriteDeviderLine>
      )}
      <TransitionGroup component={null}>
        {nonFavoriteStreams?.map((stream) => (
          <CSSTransition
            key={stream.user_id}
            classNames={feedVideoSizeProps.transition || 'videoFadeSlide'}
            {...cssTransitionAttrs}
          >
            <StreamEle
              key={stream.id}
              data={stream}
              newlyAdded={stream.newlyAdded}
              {...streamEleAttrs}
            />
          </CSSTransition>
        ))}
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
export default Twitch;
