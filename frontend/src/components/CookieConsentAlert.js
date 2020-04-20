import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import Util from "../util/Util";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  height: 7rem;
  background: #0f0f0f;
  color: white;
  text-align: center;
  width: 100vw;
  font-size: 1.1rem;
  border-top: 2px solid #fff;
  padding: 10px;
`;

export default () => {
  const [accepted, setAccepted] = useState(Util.getCookie("cookieConsentAccepted"));

  if (!accepted) {
    return (
      <Container>
        <p>This website uses cookies to deliver the best experience on our website.</p>
        <Button
          variant='info'
          onClick={() => {
            document.cookie = "cookieConsentAccepted=true; path=/; SameSite=Lax";
            setAccepted(true);
          }}>
          I understand
        </Button>
      </Container>
    );
  }
  return null;
};
