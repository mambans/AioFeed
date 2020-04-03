import React, { useState, useEffect, useContext } from "react";

import { StyledAccAlert } from "./StyledComponent";
import NavigationContext from "../NavigationContext";

export default () => {
  const { alert, setAlert } = useContext(NavigationContext);
  const [show, setShow] = useState(alert);

  useEffect(() => {
    setShow(alert);
  }, [alert]);

  useEffect(() => {
    return () => {
      setAlert();
    };
  }, [setAlert]);

  if (show && alert) {
    return (
      <StyledAccAlert variant={alert.variant} onClose={() => setShow(false)} dismissible>
        <span>
          {alert.bold && <b>{alert.bold}</b>}
          {alert.message}
        </span>
      </StyledAccAlert>
    );
  } else {
    return null;
  }
};
