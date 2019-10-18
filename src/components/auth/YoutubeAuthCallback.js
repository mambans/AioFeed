import { Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  // name = name.replace(/[\[\]]/g, "\\$&");
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function YoutubeAuthCallback({ data }) {
  const [error, setError] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  const getAccessToken = useCallback(async () => {
    const authCode = getParameterByName("access_token");
    const authCodeExpireParam = getParameterByName("expires_in");
    const authCodeExpire = authCodeExpireParam;

    const validateToken = await axios.post(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${authCode}`
    );

    if (validateToken.data.aud === process.env.REACT_APP_YOUTUBE_CLIENT_ID) {
      document.cookie = `Youtube-access_token=${authCode}; path=/`;
      document.cookie = `Youtube-access_token_expire=${authCodeExpire}; path=/`;
    }

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
              data.setAccountModalOpen(false);
              data.setConnectedDomain("Youtube");
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
  }, [data, getAccessToken]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (authenticated) {
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
