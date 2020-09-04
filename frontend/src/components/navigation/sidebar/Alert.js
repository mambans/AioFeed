import React, { useState, useEffect, useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';

import NavigationContext from '../NavigationContext';

const StyledAccAlert = styled(Alert)`
  text-align: center;
  opacity: '0.7';

  .close {
    padding: 0 7px 0 0;
  }
`;

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
