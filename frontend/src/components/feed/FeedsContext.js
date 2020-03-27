import React, { useState } from "react";

import Util from "./../../util/Util";

export const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    Util.getCookie("Twitch-access_token") && Util.getCookie("Twitch_feedEnabled")
  );

  const [enableYoutube, setEnableYoutube] = useState(
    Util.getCookie(`Youtube-access_token`) && localStorage.getItem("YoutubeFeedEnabled") === "true"
  );
  const [enableTwitchVods, setEnableTwitchVods] = useState(
    Util.getCookie(`Twitch-access_token`) &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "true"
  );

  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    localStorage.getItem(`TwitchVideoHoverEnabled`) === "true"
  );
  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    localStorage.getItem(`YoutubeVideoHoverEnabled`) === "true"
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
      }}>
      {children}
    </FeedsContext.Provider>
  );
};
