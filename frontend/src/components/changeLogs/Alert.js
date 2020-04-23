import React, { useState } from "react";
import styled from "styled-components";

import Util from "../../util/Util";
import { AddCookie } from "../../util/Utils";
import { Alert } from "react-bootstrap";

const StyledAlert = styled(Alert)`
  text-align: center;
`;

export default ({ AlertName }) => {
  const [show, setShow] = useState(!Util.getCookie(AlertName));

  const handleClose = () => {
    setShow(false);
    AddCookie(AlertName, true);
  };

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
