import React, { useState } from "react";

import Util from "./../../util/Util";

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [twitchToken, setTwitchToken] = useState(Util.getCookie(`Twitch-access_token`));
  const [refreshToken, setRefreshToken] = useState(Util.getCookie(`Twitch-refresh_token`));
  const [youtubeToken, setYoutubeToken] = useState(Util.getCookie(`Youtube-access_token`));
  const [authKey, setAuthKey] = useState(Util.getCookie(`AioFeed_AuthKey`));
  const [username, setUsername] = useState(Util.getCookie(`AioFeed_AccountName`));
  const [profileImage, setProfileImage] = useState(Util.getCookie(`AioFeed_AccountProfileImg`));
  const [twitchUserId, setTwitchUserId] = useState(Util.getCookie(`AioFeed_TwitchUserId`));
  const [twitchUsername, setTwitchUsername] = useState(Util.getCookie(`Twitch-username`));
  const [twitchProfileImg, setTwitchProfileImg] = useState(
    Util.getCookie(`AioFeed_TwitchProfileImg`)
  );
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(
    Util.getCookie(`Twitch_AutoRefresh`) || false
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

export default AccountContext;
