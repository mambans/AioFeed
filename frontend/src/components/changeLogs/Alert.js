import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert } from 'react-bootstrap';

const StyledAlert = styled(Alert)`
  text-align: center;
`;

export default () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  if (show) {
    return (
      <StyledAlert variant='info' dismissible onClose={handleClose}>
        <Alert.Heading>If something, do something</Alert.Heading>
        <hr />
        Something happended, do that thing.
      </StyledAlert>
    );
  }
  return '';
};
