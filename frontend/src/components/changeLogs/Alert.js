import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";

import { AddCookie, getCookie } from "../../util/Utils";

const StyledAlert = styled(Alert)`
  text-align: center;
`;

export default ({ AlertName }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    AddCookie(AlertName, true);
  };

  useEffect(() => {
    setShow(!getCookie(AlertName));
  }, [AlertName]);

  if (show) {
    return (
      <StyledAlert variant='info' dismissible onClose={handleClose}>
        <Alert.Heading>If something, do something</Alert.Heading>
        <hr />
        Something happended, do that thing.
      </StyledAlert>
    );
  } else {
    return "";
  }
};
