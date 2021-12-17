import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';

const StyledAlert = styled(Alert)`
  text-align: center;
  width: 86%;
  margin: auto;
  margin-top: 50px;
  opacity: 0.7;
`;

const AlertHandler = (data) => {
  const {
    title,
    message,
    children,
    style,
    onClose,
    element = null,
    type = 'warning',
    show: manualShow = true,
    hideMessage,
    dismissible = true,
  } = data?.data || data;
  const [show, setShow] = useState(Boolean(title || message));

  if (show && Boolean(manualShow)) {
    return (
      <StyledAlert
        variant={type}
        dismissible={Boolean(onClose || dismissible)}
        onClose={() => {
          onClose && onClose();
          setShow(false);
        }}
        style={style}
      >
        <Alert.Heading>{title?.toString() || 'Oh-oh! Something bad happened.'}</Alert.Heading>
        {!hideMessage && <hr />}
        {!hideMessage &&
          (message?.toString() || 'An unexpected error occured. Try refreshing the page.')}
        {element}
        {children}
      </StyledAlert>
    );
  }

  return null;
};

export default AlertHandler;
