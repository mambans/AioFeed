import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";

import Util from "../../util/Util";

export default data => {
  console.log("TCL: ErrorHandler -> data", data);
  const [errorMessage, setErrorMessage] = useState(data.data.message);
  const [errorTitle, setErrorTitle] = useState();
  const [show, setShow] = useState(true);

  useEffect(() => {
    (async () => {
      let error;

      switch (data.data.message) {
        case "Network Error":
          error = data.data.message + " -Database server may be offline.";
          break;
        default:
          error = data.data.message;
          break;
      }

      setErrorMessage(error);
      setErrorTitle(data.data.title ? data.data.title : "Oh-oh! Something bad happened.");
    })();
  }, [data.data.message, data.data.title, errorMessage]);

  if (show && data) {
    return (
      <Alert
        variant='warning'
        style={Util.feedAlertWarning}
        dismissible
        onClose={() => setShow(false)}>
        <Alert.Heading>{errorTitle}</Alert.Heading>
        <hr />
        {errorMessage.toString()}
      </Alert>
    );
  } else {
    return null;
  }
};