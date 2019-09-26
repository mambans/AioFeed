import React from "react";
import { Alert } from "react-bootstrap";

import Utilities from "utilities/Utilities";

function SuccessfullyConnected() {
  const url = new URL(window.location.href);

  if (
    url.searchParams.get("TwitchloggedIn") &&
    sessionStorage.getItem("TwitchLoggedIn") &&
    Utilities.getCookie("Twitch-access_token")
  ) {
    return (
      <>
        <Alert variant='success' style={Utilities.alertWarning}>
          <Alert.Heading>Successfully connected with Twitch!</Alert.Heading>
          <hr />
        </Alert>
      </>
    );
  } else if (
    url.searchParams.get("YoutubeloggedIn") &&
    sessionStorage.getItem("YoutubeLoggedIn") &&
    Utilities.getCookie("Youtube-access_token")
  ) {
    return (
      <>
        <Alert variant='success' style={Utilities.alertWarning}>
          <Alert.Heading>Successfully connected with Youtube!</Alert.Heading>
          <hr />
        </Alert>
      </>
    );
  } else {
    return null;
  }
}

export default SuccessfullyConnected;
