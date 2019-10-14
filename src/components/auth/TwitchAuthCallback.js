import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import Utilities from "utilities/Utilities";
import ErrorHandeling from "./../error/Error";

function TwitchAuthCallback({ data }) {
  const [error, setError] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  const getAccessToken = useCallback(async url => {
    const authCode = url.searchParams.get("code");

    const requestAccessToken = await axios.post(`https://id.twitch.tv/oauth2/token
?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}
&client_secret=${process.env.REACT_APP_TWITCH_SECRET}
&code=${authCode}
&grant_type=authorization_code
&redirect_uri=http://localhost:3000/auth/twitch/callback`);

    const accessToken = requestAccessToken.data.access_token;

    document.cookie = `Twitch-access_token=${accessToken}; path=/`;

    await axios.put(`http://localhost:3100/notifies/account/twitch/connect`, {
      accountName: Utilities.getCookie("Notifies_AccountName"),
      accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
      twitchToken: accessToken,
    });

    // const validateToken = await axios.post(`https://id.twitch.tv/oauth2/validate`, {
    //   headers: {
    //     Authorization: "OAuth " + authCode,
    //   },
    // });
    // console.log("TCL: TwitchAuth -> validateToken", validateToken);
  }, []);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const url = new URL(window.location.href);

        if (url.pathname === "/auth/twitch/callback") {
          if (url.searchParams.get("state") === Utilities.getCookie("Twitch-myState")) {
            await getAccessToken(url)
              .then(() => {
                setAuthenticated(true);
              })
              .catch(error => {
                setAuthenticated(false);
                setError(error);
              });
          } else {
            setError({ message: "Request didn't come from this website." });
          }
        } else {
          setError({ message: "Authendication to Twitch failed." });
        }
      } catch (error) {
        setError(error);
      }
    }

    handleAuthCallback();
  }, [getAccessToken]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else if (authenticated) {
    data.setAccountModalOpen(true);
    data.setConnectedDomain("Twitch");
    return <Redirect to='/account'></Redirect>;
  } else {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}

export default TwitchAuthCallback;
