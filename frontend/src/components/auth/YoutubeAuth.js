import { Spinner } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import uniqid from "uniqid";

import Utilities from "../../utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function YoutubeAuth() {
  const [error, setError] = useState();

  const initiateAuth = useCallback(async () => {
    async function generateOrginState() {
      return uniqid();

      // return randomstring.generate({
      //   capitalization: "lowercase",
      //   length: 32,
      // });
    }

    const orginState = await generateOrginState();

    document.cookie = `Youtube-myState=${orginState}; path=/`;

    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true&state=${myState.current}`;

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/youtube/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube&include_granted_scopes=true&state=${orginState}`;
  }, []);

  useEffect(() => {
    async function handleAuth() {
      const url = new URL(window.location.href);

      try {
        url.href === "http://localhost:3000/auth/youtube"
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

export default YoutubeAuth;
