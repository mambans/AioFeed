import React, { useState } from "react";

import FeedsContext from "./FeedsContext";
import Utilities from "./../../utilities/Utilities";

export default ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    Utilities.getCookie("Twitch-access_token") !== null &&
      localStorage.getItem("TwitchFeedEnabled") === "true"
  );
  const [enableYoutube, setEnableYoutube] = useState(
    Utilities.getCookie(`Youtube-access_token`) !== null &&
      localStorage.getItem("YoutubeFeedEnabled") === "true"
  );
  const [enableTwitchVods, setEnableTwitchVods] = useState(
    Utilities.getCookie(`Twitch-access_token`) !== null &&
      localStorage.getItem("TwitchVodsFeedEnabled") === "true"
  );

  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    localStorage.getItem(`TwitchVideoHoverEnabled`) === "true"
  );
  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    localStorage.getItem(`YoutubeVideoHoverEnabled`) === "true"
  );

  const [refresh, setRefresh] = useState(false);

  return (
    <FeedsContext.Provider
      value={{
        enableTwitch: enableTwitch,
        setEnableTwitch: setEnableTwitch,
        enableYoutube: enableYoutube,
        setEnableYoutube: setEnableYoutube,
        enableTwitchVods: enableTwitchVods,
        setEnableTwitchVods: setEnableTwitchVods,
        refresh: refresh,
        setRefresh: setRefresh,
        twitchVideoHoverEnable: twitchVideoHoverEnable,
        setTwitchVideoHoverEnable: setTwitchVideoHoverEnable,
        youtubeVideoHoverEnable: youtubeVideoHoverEnable,
        setYoutubeVideoHoverEnable: setYoutubeVideoHoverEnable,
      }}>
      {children}
    </FeedsContext.Provider>
  );
};
