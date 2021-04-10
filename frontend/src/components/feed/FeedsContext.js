import React, { useState } from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import { getLocalstorage } from './../../util/Utils';

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [pref, setPref] =
    useLocalStorageState('FeedPreferences', {
      size: 100,
      twitch_sidebar: true,
      twitch_bigFeed: true,
    }) || {};
  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

  const [twitterLists, setTwitterLists] = useState(getLocalstorage('Twitter-Lists'));

  const feedVideoSizeProps = {
    width: 336 * (parseInt(pref.size) / 100),
    margin: 7 * (parseInt(pref.size) / 100),
    fontSize: 16 * (parseInt(pref.size) / 100),
    totalWidth: 7 * (parseInt(pref.size) / 100) * 2 + 336 * (parseInt(pref.size) / 100),
    transition: 'videoFadeSlide',
  };

  return (
    <FeedsContext.Provider
      value={{
        enableTwitch: Boolean(pref.twitch),
        setEnableTwitch: () => toggle('twitch'),
        enableYoutube: Boolean(pref.youtube),
        setEnableYoutube: () => toggle('youtube'),
        enableTwitchVods: Boolean(pref.vods),
        setEnableTwitchVods: () => toggle('vods'),
        enableFavorites: Boolean(pref.favorites),
        setEnableFavorites: () => toggle('favorites'),
        enableTwitter: Boolean(pref.twitter),
        setEnableTwitter: () => toggle('twitter'),
        showTwitchSidebar: Boolean(pref.twitch_sidebar),
        setShowTwitchSidebar: () => toggle('twitch_sidebar'),
        twitterLists,
        setTwitterLists,
        showTwitchBigFeed: Boolean(pref.twitch_bigFeed),
        setShowTwitchBigFeed: () => toggle('twitch_bigFeed'),
        feedSize: parseInt(pref.size),
        setFeedSize: (v) => toggle('size', v),
        feedVideoSizeProps,
        toggle,
      }}
    >
      {children}
    </FeedsContext.Provider>
  );
};

export default FeedsContext;
