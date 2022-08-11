import React, { useContext, useEffect, useState } from 'react';
import Alert from '../../components/alert';
import FeedsContext from './FeedsContext';

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

  if (noFeeds) {
    <Alert
      type='info'
      title='No feeds enabled'
      message='Enable feeds in the navigation sidebar on the right.'
    />;
  }
  return null;
};

export default NoFeedsEnabled;
