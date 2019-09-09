import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import randomstring from "randomstring";
import { Spinner } from "react-bootstrap";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function TwitchAuth() {
  const [error, setError] = useState();
  const myState = useRef();

  const initiateAuth = useCallback(() => {
    myState.current = randomstring.generate({
      capitalization: "lowercase",
      length: 32,
    });

    sessionStorage.setItem("myState", myState.current);

    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/twitch/auth&scope=channel:read:subscriptions&response_type=code&state=${myState.current}`;
  }, []);

  const getAccessToken = useCallback(async url => {
    const authCode = url.searchParams.get("code");
    const response = await axios.post(`https://id.twitch.tv/oauth2/token
?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}
&client_secret=${process.env.REACT_APP_TWITCH_SECRET}
&code=${authCode}
&grant_type=authorization_code
&redirect_uri=http://localhost:3000/twitch/auth`);

    localStorage.setItem("access_token", response.data.access_token);
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);

      if (url.href === "http://localhost:3000/login") {
        initiateAuth();
      } else {
        if (url.searchParams.get("state") === sessionStorage.getItem("myState")) {
          getAccessToken(url);
          sessionStorage.setItem("TwitchLoggedIn", true);
          window.location.href = "http://localhost:3000?TwitchloggedIn=true";
        } else {
          setError({ message: "Request didn't come from this website." });
        }
      }
    } catch (error) {
      setError(error);
    }
  }, [getAccessToken, initiateAuth]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else {
    return (
      <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
}

export default TwitchAuth;
