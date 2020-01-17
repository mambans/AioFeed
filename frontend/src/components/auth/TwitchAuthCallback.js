import axios from "axios";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Spinner } from "react-bootstrap";

import Utilities from "../../utilities/Utilities";
import ErrorHandeling from "./../error/Error";
import AccountContext from "./../account/AccountContext";
import NavigationContext from "./../navigation/NavigationContext";
import LoadingIndicator from "./../LoadingIndicator";

function TwitchAuthCallback() {
  const [error, setError] = useState();
  const {
    username,
    setTwitchUserId,
    setTwitchDisplayName,
    setTwitchProfileImg,
    setTwitchToken,
  } = useContext(AccountContext);
  const { setVisible } = useContext(NavigationContext);

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

      document.cookie = `Twitch-access_token=${accessToken}; path=/`;
      document.cookie = `Twitch-refresh_token=${refreshToken}; path=/`;

      await axios
        .get(`https://api.twitch.tv/helix/users`, {
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(res => {
          document.cookie = `Notifies_TwitchUserId=${res.data.data[0].id}; path=/`;
          document.cookie = `Notifies_TwitchDisplayName=${res.data.data[0].display_name}; path=/`;
          document.cookie = `Notifies_TwitchProfileImg=${res.data.data[0].profile_image_url}; path=/`;
          setTwitchUserId(res.data.data[0].id);
          setTwitchDisplayName(res.data.data[0].display_name);
          setTwitchProfileImg(res.data.data[0].profile_image_url);
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
    [username, setTwitchUserId, setTwitchDisplayName, setTwitchProfileImg]
  );

  useEffect(() => {
    setVisible(false);
    async function handleAuthCallback() {
      try {
        const url = new URL(window.location.href);

        if (url.pathname === "/auth/twitch/callback") {
          if (url.searchParams.get("state") === Utilities.getCookie("Twitch-myState")) {
            await getAccessToken(url)
              .then(() => {
                // setAuthenticated(true);
                localStorage.setItem("TwitchFeedEnabled", "true");
                setTwitchToken(true);
                setTimeout(() => {
                  window.close();
                }, 1);
              })
              .catch(error => {
                // setAuthenticated(false);
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
    }

    handleAuthCallback();
  }, [getAccessToken, setVisible, setTwitchToken]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else {
    return <LoadingIndicator height={150} width={150} />;
  }
}

export default TwitchAuthCallback;
