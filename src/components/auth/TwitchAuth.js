import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import randomstring from "randomstring";
import { Spinner } from "react-bootstrap";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function TwitchAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(async () => {
    const orginState = randomstring.generate({
      capitalization: "lowercase",
      length: 32,
    });

    async function setStateCookie() {
      document.cookie = `Twitch-myState=${orginState}; path=/`;
    }
    await setStateCookie();

    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/twitch/auth&scope=channel:read:subscriptions+user:edit+user:read:broadcast&response_type=code&state=${orginState}`;
  }, []);

  const getAccessToken = useCallback(async url => {
    const authCode = url.searchParams.get("code");

    const requestAccessToken = await axios.post(`https://id.twitch.tv/oauth2/token
?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}
&client_secret=${process.env.REACT_APP_TWITCH_SECRET}
&code=${authCode}
&grant_type=authorization_code
&redirect_uri=http://localhost:3000/twitch/auth`);

    const accessToken = requestAccessToken.data.access_token;

    async function setStateCookie() {
      document.cookie = `Twitch-access_token=${accessToken}; path=/`;
    }

    await setStateCookie();

    await axios.put(`http://localhost:3100/notifies/account/twitch/connect`, {
      accountName: Utilities.getCookie("Notifies_AccountName"),
      accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
      twitchToken: accessToken,
    });

    // window.location.href = "http://localhost:3000?TwitchloggedIn=true";

    // const validateToken = await axios.post(`https://id.twitch.tv/oauth2/validate`, {
    //   headers: {
    //     Authorization: "OAuth " + authCode,
    //   },
    // });
    // console.log("TCL: TwitchAuth -> validateToken", validateToken);
  }, []);

  useEffect(() => {
    async function handleAuth() {
      try {
        const url = new URL(window.location.href);

        if (
          url.href === "http://localhost:3000/login" ||
          url.href === `http://localhost:3000/login`
        ) {
          initiateAuth();
        } else if (url.pathname === "/twitch/auth") {
          if (url.searchParams.get("state") === Utilities.getCookie("Twitch-myState")) {
            try {
              await getAccessToken(url);
              window.location.href = `http://localhost:3000/account?TwitchConnected=true`;
            } catch (error) {
              setError(error);
            }
          } else {
            setError({ message: "Request didn't come from this website." });
          }
        }
      } catch (error) {
        setError(error);
      }
    }

    handleAuth();
  }, [getAccessToken, initiateAuth]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}

export default TwitchAuth;
