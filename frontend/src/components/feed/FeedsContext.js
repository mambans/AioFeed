import React, { useState } from 'react';

import { getCookie, getLocalstorage } from './../../util/Utils';

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    getCookie('Twitch-access_token') && getCookie('Twitch_FeedEnabled')
  );

  const [showTwitchSidebar, setShowTwitchSidebar] = useState(
    getCookie('Twitch-access_token') && getCookie('Twitch_SidebarEnabled')
  );

  const [enableTwitter, setEnableTwitter] = useState(getCookie('Twitter_FeedEnabled'));

  const [twitterLists, setTwitterLists] = useState(getLocalstorage('Twitter-Lists'));

  const [enableYoutube, setEnableYoutube] = useState(
    getCookie(`Youtube-access_token`) && getCookie('Youtube_FeedEnabled')
  );

  const [enableTwitchVods, setEnableTwitchVods] = useState(
    getCookie(`Twitch-access_token`) && getCookie('TwitchVods_FeedEnabled')
  );

  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    getCookie('TwitchVideoHoverEnabled')
  );

  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    getCookie('YoutubeVideoHoverEnabled')
  );

  const [isEnabledOfflineNotifications, setIsEnabledOfflineNotifications] = useState(
    getCookie('Twitch_offline_notifications')
  );

  const [isEnabledUpdateNotifications, setIsEnabledUpdateNotifications] = useState(
    getCookie('Twitch_update_notifications')
  );

  const [enableForceRefreshThumbnail, setEnableForceRefreshThumbnail] = useState(
    getCookie('Twitch_thumbnail_refresh')
  );

  return (
    <FeedsContext.Provider
      value={{
        enableTwitch,
        setEnableTwitch,
        enableYoutube,
        setEnableYoutube,
        enableTwitchVods,
        setEnableTwitchVods,
        twitchVideoHoverEnable,
        setTwitchVideoHoverEnable,
        youtubeVideoHoverEnable,
        setYoutubeVideoHoverEnable,
        setEnableTwitter,
        enableTwitter,
        isEnabledOfflineNotifications,
        setIsEnabledOfflineNotifications,
        showTwitchSidebar,
        setShowTwitchSidebar,
        isEnabledUpdateNotifications,
        setIsEnabledUpdateNotifications,
        twitterLists,
        setTwitterLists,
        enableForceRefreshThumbnail,
        setEnableForceRefreshThumbnail,
      }}
    >
      {children}
    </FeedsContext.Provider>
  );
};

export default FeedsContext;
