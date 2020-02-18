import React, { useState } from "react";

import FeedsContext from "./FeedsContext";
import Utilities from "./../../utilities/Utilities";

export default ({ children }) => {
  const [enableTwitch, setEnableTwitch] = useState(
    Utilities.getCookie("Twitch-access_token") && Utilities.getCookie("Twitch_feedEnabled")
  );

  const [enableYoutube, setEnableYoutube] = useState(
    Utilities.getCookie(`Youtube-access_token`) &&
      localStorage.getItem("YoutubeFeedEnabled") === "true"
  );
  const [enableTwitchVods, setEnableTwitchVods] = useState(
    Utilities.getCookie(`Twitch-access_token`) &&
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
