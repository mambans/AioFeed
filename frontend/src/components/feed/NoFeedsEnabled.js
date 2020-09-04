import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import FeedsContext from './FeedsContext';
import AlertHandler from './../alert';

export default () => {
  const { enableTwitch, enableYoutube, enableTwitchVods, enableTwitter } = useContext(FeedsContext);
  const [noFeeds, setNoFeeds] = useState(
    !enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods
  );
  useEffect(() => {
    let timer;
    if (!enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods) {
      timer = setTimeout(() => {
        setNoFeeds(true);
      }, 1000);
    } else {
      clearTimeout(timer);
      setNoFeeds(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [enableTwitch, enableYoutube, enableTwitchVods, enableTwitter]);

  return (
    <CSSTransition
      in={noFeeds}
      timeout={{ appear: 1000, enter: 1000, exit: 0 }}
      classNames='NoFeedsEnabled-Fade'
      unmountOnExit
    >
      <AlertHandler
        type='info'
        title='No feeds enabled'
        message='Enable feeds in the navigation sidebar on the right.'
      />
    </CSSTransition>
  );
};
