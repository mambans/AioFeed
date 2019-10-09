import React from "react";
import { Alert } from "react-bootstrap";
import { Animated } from "react-animated-css";

import Utilities from "utilities/Utilities";

function SuccessfullyConnected() {
  const url = new URL(window.location.href);

  if (url.searchParams.get("TwitchConnected") && Utilities.getCookie("Twitch-access_token")) {
    return (
      <Animated
        animationIn='fadeInDown'
        animationOut='fadeOutUp'
        animationOutDelay={3000}
        animationOutDuration={2000}
        isVisible={false}
        style={{ width: "40%", minWidth: "1000px", margin: "auto" }}>
        <Alert
          variant='success'
          style={Utilities.alertWarning}
          // onClose={() => document.querySelector(".animated").setAttribute("isVisible", false)}
          dismissible>
          <Alert.Heading>Successfully connected with Twitch!</Alert.Heading>
          <hr />
        </Alert>
      </Animated>
    );
  } else if (
    url.searchParams.get("YoutubeConnected") &&
    Utilities.getCookie("Youtube-access_token")
  ) {
    return (
      <Animated
        animationIn='fadeInDown'
        animationOut='fadeOutUp'
        animationOutDelay={3000}
        animationOutDuration={2000}
        isVisible={false}
        style={{ width: "40%", minWidth: "1000px", margin: "auto" }}>
        <Alert variant='success' style={Utilities.alertWarning} dismissible>
          <Alert.Heading>Successfully connected with Youtube!</Alert.Heading>
          <hr />
        </Alert>
      </Animated>
    );
  } else {
    return "";
  }
}

export default SuccessfullyConnected;
