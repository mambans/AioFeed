import React, { useState } from "react";
import AccountContext from "./AccountContext";

import Utilities from "./../../utilities/Utilities";

export default ({ children }) => {
  const [twitchToken, setTwitchToken] = useState(Utilities.getCookie(`Twitch-access_token`));
  const [refreshToken, setRefreshToken] = useState(Utilities.getCookie(`Twitch-refresh_token`));
  const [youtubeToken, setYoutubeToken] = useState(Utilities.getCookie(`Youtube-access_token`));
  const [authKey, setAuthKey] = useState(Utilities.getCookie(`Notifies_AuthKey`));
  const [username, setUsername] = useState(Utilities.getCookie(`Notifies_AccountName`));
  const [profileImage, setProfileImage] = useState(
    Utilities.getCookie(`Notifies_AccountProfileImg`)
  );
  const [twitchUserId, setTwitchUserId] = useState(Utilities.getCookie(`Notifies_TwitchUserId`));
  const [twitchUsername, setTwitchUsername] = useState(Utilities.getCookie(`Twitch-username`));
  const [twitchProfileImg, setTwitchProfileImg] = useState(
    Utilities.getCookie(`Notifies_TwitchProfileImg`)
  );
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(
    Utilities.getCookie(`Twitch_AutoRefresh`) || false
  );

  return (
    <AccountContext.Provider
      value={{
        twitchToken: twitchToken,
        setTwitchToken: setTwitchToken,
        youtubeToken: youtubeToken,
        setYoutubeToken: setYoutubeToken,
        authKey: authKey,
        setAuthKey: setAuthKey,
        username: username,
        setUsername: setUsername,
        profileImage: profileImage,
        setProfileImage: setProfileImage,
        twitchUserId: twitchUserId,
        setTwitchUserId: setTwitchUserId,
        twitchUsername: twitchUsername,
        setTwitchUsername: setTwitchUsername,
        twitchProfileImg: twitchProfileImg,
        setTwitchProfileImg: setTwitchProfileImg,
        autoRefreshEnabled: autoRefreshEnabled,
        setAutoRefreshEnabled: setAutoRefreshEnabled,
        refreshToken: refreshToken,
        setRefreshToken: setRefreshToken,
      }}>
      {children}
    </AccountContext.Provider>
  );
};
