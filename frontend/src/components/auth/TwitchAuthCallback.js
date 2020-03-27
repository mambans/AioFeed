import axios from "axios";
import React, { useEffect, useState, useCallback, useContext } from "react";

import Util from "../../util/Util";
import ErrorHandler from "./../error";
import AccountContext from "./../account/AccountContext";
import NavigationContext from "./../navigation/NavigationContext";
import LoadingIndicator from "./../LoadingIndicator";
import FeedsContext from "../feed/FeedsContext";

function TwitchAuthCallback() {
  const [error, setError] = useState();
  const {
    username,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImg,
    setTwitchToken,
    setRefreshToken,
    autoRefreshEnabled,
  } = useContext(AccountContext);
  const { setVisible } = useContext(NavigationContext);
  const { enableTwitch } = useContext(FeedsContext);

  const getAccessToken = useCallback(
    async url => {
      const authCode = url.searchParams.get("code");

      const requestAccessToken = await axios.post(`https://id.twitch.tv/oauth2/token
?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}
&client_secret=${process.env.REACT_APP_TWITCH_SECRET}
&code=${authCode}
&grant_type=authorization_code
&redirect_uri=http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/auth/twitch/callback`);

      const accessToken = requestAccessToken.data.access_token;
      const refreshToken = requestAccessToken.data.refresh_token;

      document.cookie = `Twitch-access_token=${accessToken}; path=/; SameSite=Lax`;
      document.cookie = `Twitch-refresh_token=${refreshToken}; path=/; SameSite=Lax`;

      await axios
        .get(`https://api.twitch.tv/helix/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(async res => {
          document.cookie = `Notifies_TwitchUserId=${res.data.data[0].id}; path=/; SameSite=Lax`;
          document.cookie = `Twitch-username=${res.data.data[0].login}; path=/; SameSite=Lax`;
          document.cookie = `Notifies_TwitchProfileImg=${res.data.data[0].profile_image_url}; path=/`;
          setTwitchToken(accessToken);
          setRefreshToken(refreshToken);

          setTwitchUserId(res.data.data[0].id);
          setTwitchUsername(res.data.data[0].login);
          setTwitchProfileImg(res.data.data[0].profile_image_url);

          await axios
            .put(
              `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/preferences`,
              {
                username: username,
                dataName: "TwitchPreferences",
                data: {
                  Username: res.data.data[0].login,
                  Id: res.data.data[0].id,
                  Profile: res.data.data[0].profile_image_url,
                  AutoRefresh: autoRefreshEnabled,
                  enabled: enableTwitch,
                },
              }
            )
            .catch(e => {
              console.error(e);
            });
        });

      await axios
        .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
          username: username,
          token: accessToken,
          tokenName: "TwitchToken",
        })
        .catch(e => {
          console.error(e);
        });
    },
    [
      username,
      setTwitchUserId,
      setTwitchUsername,
      setTwitchProfileImg,
      setTwitchToken,
      setRefreshToken,
      autoRefreshEnabled,
      enableTwitch,
    ]
  );

  useEffect(() => {
    setVisible(false);
    (async function() {
      try {
        const url = new URL(window.location.href);

        if (url.pathname === "/auth/twitch/callback") {
          if (url.searchParams.get("state") === Util.getCookie("Twitch-myState")) {
            await getAccessToken(url)
              .then(() => {
                document.cookie = `Twitch_feedEnabled=${true}; path=/`;
                console.log("successfully authenticated to Twitch.");
                setTimeout(() => {
                  window.close();
                }, 1);
              })
              .catch(error => {
                console.log("getAccessToken() failed");
                setError(error);
              });
          } else {
            setError({ message: "Request didn't come from this website." });
          }
        } else {
          setError({ message: "Authenticate to Twitch failed." });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken, setVisible, setTwitchToken]);

  if (error) {
    return <ErrorHandler data={error}></ErrorHandler>;
  } else {
    return <LoadingIndicator height={150} width={150} />;
  }
}

export default TwitchAuthCallback;
