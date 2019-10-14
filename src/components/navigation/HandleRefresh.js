import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import Utilities from "../../utilities/Utilities";

function HandleRefresh({ children }) {
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [connectedDomain, setConnectedDomain] = useState(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return children({
      refresh: refresh,
      setRefresh: setRefresh,
      connectedDomain: connectedDomain,
      setConnectedDomain: setConnectedDomain,
      accountModalOpen: accountModalOpen,
      setAccountModalOpen: setAccountModalOpen,
    });
  }
}

export default HandleRefresh;
