import React, { useState } from "react";
import AccountContext from "./AccountContext";

import Utilities from "./../../utilities/Utilities";

export default ({ children }) => {
  const [twitchToken, setTwitchToken] = useState(Utilities.getCookie(`Twitch-access_token`));
  const [youtubeToken, setYoutubeToken] = useState(Utilities.getCookie(`Youtube-access_token`));

  return (
    <AccountContext.Provider
      value={{
        twitchToken: twitchToken,
        setTwitchToken: setTwitchToken,
        youtubeToken: youtubeToken,
        setYoutubeToken: setYoutubeToken,
      }}>
      {children}
    </AccountContext.Provider>
  );
};
