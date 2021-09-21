import React from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [pref, setPref] =
    useLocalStorageState('FeedPreferences', {
      size: 100,
      twitch_sidebar: true,
      twitch_bigFeed: true,
    }) || {};
  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

  const [twitterLists, setTwitterLists] = useLocalStorageState('Twitter-Lists');

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
        setEnableTwitch: (v) => toggle('twitch', v),
        enableYoutube: Boolean(pref.youtube),
        setEnableYoutube: (v) => toggle('youtube', v),
        enableTwitchVods: Boolean(pref.vods),
        setEnableTwitchVods: (v) => toggle('vods', v),
        enableMyLists: Boolean(pref.mylists),
        setEnableMyLists: (v) => toggle('mylists', v),
        enableTwitter: Boolean(pref.twitter),
        setEnableTwitter: (v) => toggle('twitter', v),
        showTwitchSidebar: Boolean(pref.twitch_sidebar),
        setShowTwitchSidebar: (v) => toggle('twitch_sidebar', v),
        twitterLists,
        setTwitterLists,
        showTwitchBigFeed: Boolean(pref.twitch_bigFeed),
        setShowTwitchBigFeed: (v) => toggle('twitch_bigFeed', v),
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
