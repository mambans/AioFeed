import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

import Util from "../../util/Util";

export default (data) => {
  console.log("data", data);
  console.log("error data: ", data.data);
  const { title, message } = data.data;
  const [show, setShow] = useState(true);

  if (show && data) {
    return (
      <Alert
        variant='warning'
        style={Util.feedAlertWarning}
        dismissible
        onClose={() => setShow(false)}>
        <Alert.Heading>{title || "Oh-oh! Something bad happened."}</Alert.Heading>
        <hr />
        {message || "An unexpected error occured."}
        {data.element || null}
      </Alert>
    );
  } else {
    return null;
  }
};
