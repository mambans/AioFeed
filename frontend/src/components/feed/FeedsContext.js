import React, { useState } from 'react';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';

import { getCookie, getLocalstorage } from './../../util/Utils';

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    getCookie('Twitch-access_token') && getCookie('Twitch_FeedEnabled')
  );
  const [showTwitchSidebar, setShowTwitchSidebar] = useState(
    getCookie('Twitch-access_token') && getCookie('Twitch_SidebarEnabled')
  );
  const [showTwitchBigFeed, setShowTwitchBigFeed] = useState(
    getCookie('Twitch-access_token') && getCookie('Twitch_BigFeedEnabled')
  );
  const [enableTwitter, setEnableTwitter] = useState(getCookie('Twitter_FeedEnabled'));
  const [twitterLists, setTwitterLists] = useState(getLocalstorage('Twitter-Lists'));
  const [enableYoutube, setEnableYoutube] = useState(
    getCookie(`Youtube-access_token`) && getCookie('Youtube_FeedEnabled')
  );
  const [enableTwitchVods, setEnableTwitchVods] = useState(
    getCookie(`Twitch-access_token`) && getCookie('TwitchVods_FeedEnabled')
  );
  const [enableFavorites, setEnableFavorites] = useState(getCookie('Favorites_FeedEnabled'));
  const [feedSize, setFeedSize] = useSyncedLocalState('Feed-size', 'default');

  return (
    <FeedsContext.Provider
      value={{
        enableTwitch,
        setEnableTwitch,
        enableYoutube,
        setEnableYoutube,
        enableTwitchVods,
        setEnableTwitchVods,
        enableFavorites,
        setEnableFavorites,
        setEnableTwitter,
        enableTwitter,
        showTwitchSidebar,
        setShowTwitchSidebar,
        twitterLists,
        setTwitterLists,
        showTwitchBigFeed,
        setShowTwitchBigFeed,
        feedSize,
        setFeedSize,
      }}
    >
      {children}
    </FeedsContext.Provider>
  );
};

export default FeedsContext;
