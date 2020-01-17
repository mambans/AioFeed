import React, { useState } from "react";
import AccountContext from "./AccountContext";

import Utilities from "./../../utilities/Utilities";

export default ({ children }) => {
  const [twitchToken, setTwitchToken] = useState(Utilities.getCookie(`Twitch-access_token`));
  const [youtubeToken, setYoutubeToken] = useState(Utilities.getCookie(`Youtube-access_token`));
  const [authKey, setAuthKey] = useState(Utilities.getCookie(`Notifies_AuthKey`));
  const [username, setUsername] = useState(Utilities.getCookie(`Notifies_AccountName`));
  const [profileImage, setProfileImage] = useState(
    Utilities.getCookie(`Notifies_AccountProfileImg`)
  );
  const [twitchUserId, setTwitchUserId] = useState(Utilities.getCookie(`Notifies_TwitchUserId`));
  const [twitchDisplayName, setTwitchDisplayName] = useState(
    Utilities.getCookie(`Notifies_TwitchDisplayName`)
  );
  const [twitchProfileImg, setTwitchProfileImg] = useState(
    Utilities.getCookie(`Notifies_TwitchProfileImg`)
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
        twitchDisplayName: twitchDisplayName,
        setTwitchDisplayName: setTwitchDisplayName,
        twitchProfileImg: twitchProfileImg,
        setTwitchProfileImg: setTwitchProfileImg,
      }}>
      {children}
    </AccountContext.Provider>
  );
};
