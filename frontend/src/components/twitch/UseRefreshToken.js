import { useContext, useEffect } from "react";
import axios from "axios";

import AccountContext from "./../account/AccountContext";
import Utilities from "./../../utilities/Utilities";

function useRefreshToken(prevFunc) {
  console.log("Use Refresh token");
  const { refreshToken, setTwitchToken, setRefreshToken } = useContext(AccountContext);

  useEffect(() => {
    const refreshTokenRequest = async () => {
      await axios
        .post(
          `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
            refreshToken
          )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
            process.env.REACT_APP_TWITCH_SECRET
          }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
        )
        .then(async res => {
          console.log("TCL: UnfollowStream -> res", res);
          setTwitchToken(res.data.access_token);
          setRefreshToken(res.data.refresh_token);
          document.cookie = `Twitch-access_token=${res.data.access_token}; path=/`;
          document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/`;

          prevFunc(res);
        });
    };

    refreshTokenRequest();
  }, [prevFunc, setRefreshToken, setTwitchToken]);
}
export default useRefreshToken;
