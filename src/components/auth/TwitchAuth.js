import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import randomstring from "randomstring";

import Utilities from "../../utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function TwitchAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(async () => {
    async function generateOrginState() {
      return randomstring.generate({
        capitalization: "lowercase",
        length: 32,
      });
    }

    async function setStateCookie() {
      document.cookie = `Twitch-myState=${orginState}; path=/`;
    }

    const orginState = await generateOrginState();
    await setStateCookie();

    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/twitch/callback&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code&state=${orginState}`;
  }, []);

  useEffect(() => {
    async function handleAuth() {
      try {
        const url = new URL(window.location.href);

        url.href === "http://localhost:3000/auth/twitch"
          ? await initiateAuth()
          : setError({ message: "Visit account page to authendicate with Twitch." });
      } catch (error) {
        setError(error);
      }
    }

    handleAuth();
  }, [initiateAuth]);

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
