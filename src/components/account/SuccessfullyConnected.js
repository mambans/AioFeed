import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { Animated } from "react-animated-css";

import Utilities from "utilities/Utilities";

function SuccessfullyConnected() {
  const [show, setShow] = useState(true);
  const url = new URL(window.location.href);

  useEffect(() => {
    setTimeout(function() {
      setShow(false);
    }, 3000);
  }, []);

  if (show) {
    if (url.searchParams.get("TwitchConnected") && Utilities.getCookie("Twitch-access_token")) {
      return (
        <Animated
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationOutDelay={2000}
          animationOutDuration={1000}
          isVisible={false}>
          <Alert
            variant='success'
            style={Utilities.alertWarning}
            onClose={() => setShow(false)}
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
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationOutDelay={2000}
          animationOutDuration={1000}
          isVisible={false}>
          <Alert
            variant='success'
            style={Utilities.alertWarning}
            onClose={() => setShow(false)}
            dismissible>
            <Alert.Heading>Successfully connected with Youtube!</Alert.Heading>
            <hr />
          </Alert>
        </Animated>
      );
    } else {
      return "";
    }
  }
  return "";
}

export default SuccessfullyConnected;
