import React from "react";
import { Alert } from "react-bootstrap";

import Util from "../../util/Util";

function SuccessfullyConnected(data) {
  if (
    (data.domain === "Twitch" && Util.getCookie("Twitch-access_token")) ||
    (data.domain === "Youtube" && Util.getCookie("Youtube-access_token"))
  ) {
    return (
      <Alert variant='success' style={Util.alertWarning} dismissible>
        <Alert.Heading>Successfully connected with {data.domain}!</Alert.Heading>
        <hr />
      </Alert>
    );
  } else {
    return "";
  }
}

export default SuccessfullyConnected;
