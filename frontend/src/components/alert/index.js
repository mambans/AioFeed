import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import { StyledAlert } from '../sharedStyledComponents';

export default (data) => {
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
