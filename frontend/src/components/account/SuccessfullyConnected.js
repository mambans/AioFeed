import React from "react";
import { Alert } from "react-bootstrap";
import { Animated } from "react-animated-css";

import Utilities from "../../utilities/Utilities";

function SuccessfullyConnected(data) {
  if (
    (data.domain === "Twitch" && Utilities.getCookie("Twitch-access_token")) ||
    (data.domain === "Youtube" && Utilities.getCookie("Youtube-access_token"))
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
          <Alert.Heading>Successfully connected with {data.domain}!</Alert.Heading>
          <hr />
        </Alert>
      </Animated>
    );
  } else {
    return "";
  }
}

export default SuccessfullyConnected;
