import { Spinner } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import randomstring from "randomstring";
import axios from "axios";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function YoutubeAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(() => {
    const orginState = randomstring.generate({
      capitalization: "lowercase",
      length: 32,
    });

    document.cookie = `Youtube-myState=${orginState}`;

    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true&state=${myState.current}`;

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true&state=${orginState}`;
  }, []);

  const getAccessToken = useCallback(async () => {
    const url = new URL(window.location.href).hash;

    const authCode = url
      .split("#")[1]
      .split("&")[1]
      .slice(13);

    const validateToken = await axios.post(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${authCode}`
    );

    if (validateToken.data.aud === process.env.REACT_APP_YOUTUBE_CLIENT_ID) {
      document.cookie = `Youtube-access_token=${authCode}; path=/`;
    }

    // const authCodeExpire = url
    //   .split("#")[1]
    //   .split("&")[3]
    //   .replace("expires_in=", "");

    await axios.put(`http://localhost:3100/notifies/account/youtube/connect`, {
      accountName: Utilities.getCookie("Notifies_AccountName"),
      accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
      youtubeToken: authCode,
    });
  }, []);

  useEffect(() => {
    async function handleAuth() {
      const url = new URL(window.location.href);

      try {
        if (
          url.href === "http://localhost:3000/youtube/login" ||
          url.href === "http://localhost:3000/account"
        ) {
          initiateAuth();
        } else {
          if (
            url.hash
              .split("#")[1]
              .split("&")[0]
              .slice(6) === Utilities.getCookie("Youtube-myState")
          ) {
            await getAccessToken();
            window.location.href = "http://localhost:3000?YoutubeConnected=true";
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

export default YoutubeAuth;
