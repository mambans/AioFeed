import React, { useState } from 'react';

import { getCookie } from '../../util';

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [username, setUsername] = useState(getCookie(`AioFeed_AccountName`));
  const [profileImage, setProfileImage] = useState(getCookie(`AioFeed_AccountProfileImg`));
  const [authKey, setAuthKey] = useState(getCookie(`AioFeed_AuthKey`));

  const [twitchPreferences, setTwitchPreferences] = useState({
    Token: getCookie(`Twitch-access_token`),
    Refresh_token: getCookie(`Twitch-refresh_token`),
    Id: getCookie(`Twitch-userId`),
    Username: getCookie(`Twitch-username`),
    Profile: getCookie(`Twitch-profileImg`),
  });

  const [youtubePreferences, setYoutubePreferences] = useState({
    Token: getCookie(`Youtube-access_token`),
    Username: getCookie(`YoutubeUsername`),
    Profile: getCookie(`YoutubeProfileImg`),
  });

  const setTwitchPref = (n, v) => setTwitchPreferences((c) => ({ ...c, [n]: v }));
  const setYoutubePref = (n, v) => setYoutubePreferences((c) => ({ ...c, [n]: v }));

  return (
    <AccountContext.Provider
      value={{
        setTwitchPreferences,

        authKey,
        setAuthKey,
        username,
        setUsername,
        profileImage,
        setProfileImage,

        twitchToken: twitchPreferences.Token,
        setTwitchToken: (v) => setTwitchPref('Token', v),
        twitchUserId: twitchPreferences.Id,
        setTwitchUserId: (v) => setTwitchPref('Id', v),
        twitchUsername: twitchPreferences.Username,
        setTwitchUsername: (v) => setTwitchPref('Username', v),
        twitchProfileImg: twitchPreferences.Profile,
        setTwitchProfileImg: (v) => setTwitchPref('Profile', v),
        refreshToken: twitchPreferences.Refresh_token,
        setRefreshToken: (v) => setTwitchPref('Refresh_token', v),

        youtubeToken: youtubePreferences.Token,
        setYoutubeToken: (v) => setYoutubePref('Token', v),
        youtubeUsername: youtubePreferences.Username,
        setYoutubeUsername: (v) => setYoutubePref('Username', v),
        youtubeProfileImg: youtubePreferences.Profile,
        setYoutubeProfileImg: (v) => setYoutubePref('Profile', v),
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
