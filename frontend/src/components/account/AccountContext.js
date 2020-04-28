import React, { useState } from "react";

import { getCookie } from "./../../util/Utils";

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [username, setUsername] = useState(getCookie(`AioFeed_AccountName`));
  const [profileImage, setProfileImage] = useState(getCookie(`AioFeed_AccountProfileImg`));
  const [authKey, setAuthKey] = useState(getCookie(`AioFeed_AuthKey`));
  const [twitchToken, setTwitchToken] = useState(getCookie(`Twitch-access_token`));
  const [refreshToken, setRefreshToken] = useState(getCookie(`Twitch-refresh_token`));
  const [twitchUserId, setTwitchUserId] = useState(getCookie(`Twitch-userId`));
  const [twitchUsername, setTwitchUsername] = useState(getCookie(`Twitch-username`));
  const [twitchProfileImg, setTwitchProfileImg] = useState(getCookie(`Twitch-profileImg`));
  const [youtubeToken, setYoutubeToken] = useState(getCookie(`Youtube-access_token`));
  const [youtubeUsername, setYoutubeUsername] = useState(getCookie(`YoutubeUsername`));
  const [youtubeProfileImg, setYoutubeProfileImg] = useState(getCookie(`YoutubeProfileImg`));
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(
    getCookie(`Twitch_AutoRefresh`) || false
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
        youtubeUsername: youtubeUsername,
        setYoutubeUsername: setYoutubeUsername,
        youtubeProfileImg: youtubeProfileImg,
        setYoutubeProfileImg: setYoutubeProfileImg,
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
