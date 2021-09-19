import React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import useCookieState from './../../hooks/useCookieState';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  height: 7rem;
  background: rgb(21, 23, 24);
  color: rgb(200, 200, 200);
  text-align: center;
  width: 100vw;
  font-size: 1.1rem;
  border-top: 1px solid rgb(49, 49, 49);
  padding: 10px;
`;

const CookieConsentAlert = () => {
  const [accepted, setAccepted] = useCookieState('cookieConsentAccepted');

  if (!accepted) {
    return (
      <Container>
        <p>We use cookies to improve performance and deliver the best experience on our website.</p>
        <Button variant='info' onClick={() => setAccepted(true)}>
          I understand
        </Button>
      </Container>
    );
  }
  return null;
};

export default CookieConsentAlert;
