import { Spinner } from "react-bootstrap";
import React, { useEffect, useState, useCallback, useRef } from "react";
import randomstring from "randomstring";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function YoutubeAuth() {
  const [error, setError] = useState();
  const myState = useRef();

  const initiateAuth = useCallback(() => {
    myState.current = randomstring.generate({
      capitalization: "lowercase",
      length: 32,
    });

    sessionStorage.setItem("myState", myState.current);

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true&state=${myState.current}`;
  }, []);

  const getAccessToken = useCallback(() => {
    const url = new URL(window.location.href).hash;
    const authCode = url
      .split("#")[1]
      .split("&")[1]
      .slice(13);

    localStorage.setItem("Youtube-access_token", authCode);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);

    try {
      if (url.href === "http://localhost:3000/youtube/login") {
        initiateAuth();
      } else {
        if (
          url.hash
            .split("#")[1]
            .split("&")[0]
            .slice(6) === sessionStorage.getItem("myState")
        ) {
          getAccessToken();
          sessionStorage.setItem("YoutubeLoggedIn", true);
          window.location.href = "http://localhost:3000?YoutubeloggedIn=true";
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
export default YoutubeAuth;
