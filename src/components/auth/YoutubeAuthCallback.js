import { Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function YoutubeAuthCallback({ data }) {
  const [error, setError] = useState();
  const [authenticated, setAuthenticated] = useState(false);

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
          url.hash
            .split("#")[1]
            .split("&")[0]
            .slice(6) === Utilities.getCookie("Youtube-myState")
        ) {
          await getAccessToken()
            .then(() => {
              setAuthenticated(true);
            })
            .catch(error => {
              setError(error);
            });
        } else {
          setError({ message: "Request didn't come from this website." });
        }
      } catch (error) {
        setError(error);
      }
    }

    handleAuth();
  }, [getAccessToken]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (authenticated) {
    data.setAccountModalOpen(true);
    data.setConnectedDomain("Youtube");
    return <Redirect to='/account'></Redirect>;
  } else {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}

export default YoutubeAuthCallback;
