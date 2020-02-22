import { Spinner } from "react-bootstrap";
import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";

import Utilities from "../../utilities/Utilities";
import ErrorHandeling from "./../error/Error";
import AccountContext from "./../account/AccountContext";
import NavigationContext from "./../navigation/NavigationContext";

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function YoutubeAuthCallback() {
  const { setVisible } = useContext(NavigationContext);
  const [error, setError] = useState();
  const { username } = useContext(AccountContext);

  const getAccessToken = useCallback(async () => {
    const url = new URL(window.location.href);

    const accessToken = getParameterByName("access_token");
    const accessTokenExpireParam = getParameterByName("expires_in");

    const validateToken = await axios.post(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );

    if (validateToken.data.aud === process.env.REACT_APP_YOUTUBE_CLIENT_ID) {
      document.cookie = `Youtube-access_token=${accessToken}; path=/`;
      document.cookie = `Youtube-access_token_expire=${accessTokenExpireParam}; path=/`;
      document.cookie = `Youtube-readonly=${url.hash.split("&")[4].includes(".readonly")}; path=/`;
    }

    await axios
      .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        token: accessToken,
        tokenName: "YoutubeToken",
      })
      .catch(e => {
        console.error(e);
      });
  }, [username]);

  useEffect(() => {
    setVisible(false);

    (async () => {
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
              window.close();

              // setAuthenticated(true);
              // localStorage.setItem("YoutubeFeedEnabled", "true");
              // setAccountModalOpen(false);
              // setConnectedDomain("Youtube");
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
    })();
  }, [getAccessToken, setVisible]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  } else {
    return (
      <Spinner
        animation='border'
        role='status'
        style={{
          ...Utilities.loadingSpinner,
          position: "absolute",
          margin: "0",
          top: "calc(50% - 5rem)",
          left: "calc(50% - 5rem)",
        }}>
        ><span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}

export default YoutubeAuthCallback;
