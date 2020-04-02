import React, { useState } from "react";

import Util from "./../../util/Util";

const FeedsContext = React.createContext();

export const FeedsProvider = ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    Util.getCookie("Twitch-access_token") && Util.getCookie("Twitch_FeedEnabled")
  );

  const [enableYoutube, setEnableYoutube] = useState(
    Util.getCookie(`Youtube-access_token`) && Util.getCookie("YoutubeFeedEnabled")
  );

  const [enableTwitchVods, setEnableTwitchVods] = useState(
    Util.getCookie(`Twitch-access_token`) && Util.getCookie("Twitch_FeedEnabled")
  );

  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    Util.getCookie("TwitchVideoHoverEnabled")
  );

  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    Util.getCookie("YoutubeVideoHoverEnabled")
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

export default FeedsContext;
