import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import { AddCookie, getCookie } from '../../util/Utils';

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

export default () => {
  const [accepted, setAccepted] = useState(getCookie('cookieConsentAccepted'));

  if (!accepted) {
    return (
      <Container>
        <p>We use cookies to improve performance and deliver the best experience on our website.</p>
        <Button
          variant='info'
          onClick={() => {
            AddCookie('cookieConsentAccepted', 'true');
            setAccepted(true);
          }}
        >
          I understand
        </Button>
      </Container>
    );
  }
  return null;
};
