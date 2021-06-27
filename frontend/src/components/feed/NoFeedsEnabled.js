import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import FeedsContext from './FeedsContext';
import AlertHandler from './../alert';
import styled from 'styled-components';

const NoFeedsAlert = styled(AlertHandler)`
  &.NoFeedsEnabled-Fade-enter {
    opacity: 0;
    transition: opacity 1000ms;
  }

  &.NoFeedsEnabled-Fade-enter-active {
    opacity: 1;
    transition: opacity 1000ms;
  }

  &.NoFeedsEnabled-Fade-exit {
    opacity: 1;
  }

  &.NoFeedsEnabled-Fade-exit-active {
    opacity: 0;
  }

  &.NoFeedsEnabled-Fade-exit-done {
    opacity: 0;
  }
`;

const NoFeedsEnabled = () => {
  const { enableTwitch, enableYoutube, enableTwitchVods, enableTwitter } = useContext(FeedsContext);
  const [noFeeds, setNoFeeds] = useState(
    !enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods
  );
  useEffect(() => {
    let timer;
    if (!enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods) {
      timer = setTimeout(() => setNoFeeds(true), 1000);
    } else {
      clearTimeout(timer);
      setNoFeeds(false);
    }

    return () => clearTimeout(timer);
  }, [enableTwitch, enableYoutube, enableTwitchVods, enableTwitter]);

  return (
    <CSSTransition
      in={noFeeds}
      timeout={{ appear: 1000, enter: 1000, exit: 0 }}
      classNames='NoFeedsEnabled-Fade'
      unmountOnExit
    >
      <NoFeedsAlert
        type='info'
        title='No feeds enabled'
        message='Enable feeds in the navigation sidebar on the right.'
      />
    </CSSTransition>
  );
};

export default NoFeedsEnabled;
