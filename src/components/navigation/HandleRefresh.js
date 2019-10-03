import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import Utilities from "./../../utilities/Utilities";

function HandleRefresh({ children }) {
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return children({
      refresh: refresh,
      setRefresh: setRefresh,
    });
  }
}

export default HandleRefresh;
