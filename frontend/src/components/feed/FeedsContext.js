import React, { useState } from "react";

import Util from "./../../util/Util";

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    Util.getCookie("Twitch-access_token") && Util.getCookie("Twitch_FeedEnabled")
  );

  const [showTwitchSidebar, setShowTwitchSidebar] = useState(
    Util.getCookie("Twitch-access_token") && Util.getCookie("Twitch_SidebarEnabled")
  );

  const [enableTwitter, setEnableTwitter] = useState(Util.getCookie("Twitter_FeedEnabled"));

  const [twitterListName, setTwitterListName] = useState(Util.getCookie("Twitter-Listname"));

  const [enableYoutube, setEnableYoutube] = useState(
    Util.getCookie(`Youtube-access_token`) && Util.getCookie("Youtube_FeedEnabled")
  );

  const [enableTwitchVods, setEnableTwitchVods] = useState(
    Util.getCookie(`Twitch-access_token`) && Util.getCookie("TwitchVods_FeedEnabled")
  );

  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    Util.getCookie("TwitchVideoHoverEnabled")
  );

  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    Util.getCookie("YoutubeVideoHoverEnabled")
  );

  const [isEnabledOfflineNotifications, setIsEnabledOfflineNotifications] = useState(
    Util.getCookie("Twitch_offline_notifications")
  );

  return (
    <FeedsContext.Provider
      value={{
        enableTwitch: enableTwitch,
        setEnableTwitch: setEnableTwitch,
        enableYoutube: enableYoutube,
        setEnableYoutube: setEnableYoutube,
        enableTwitchVods: enableTwitchVods,
        setEnableTwitchVods: setEnableTwitchVods,
        twitchVideoHoverEnable: twitchVideoHoverEnable,
        setTwitchVideoHoverEnable: setTwitchVideoHoverEnable,
        youtubeVideoHoverEnable: youtubeVideoHoverEnable,
        setYoutubeVideoHoverEnable: setYoutubeVideoHoverEnable,
        setEnableTwitter: setEnableTwitter,
        enableTwitter: enableTwitter,
        twitterListName: twitterListName,
        setTwitterListName: setTwitterListName,
        isEnabledOfflineNotifications: isEnabledOfflineNotifications,
        setIsEnabledOfflineNotifications: setIsEnabledOfflineNotifications,
        showTwitchSidebar: showTwitchSidebar,
        setShowTwitchSidebar: setShowTwitchSidebar,
      }}>
      {children}
    </FeedsContext.Provider>
  );
};

export default FeedsContext;
