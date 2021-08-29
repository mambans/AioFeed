import React from 'react';
import { Portal } from 'react-portal';
import styled from 'styled-components';

const StyledBackDrop = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  transform: translate(0, 0, 1000);
  position: fixed;
  transition: all 500ms;
  background: ${({ transparent }) => (transparent ? 'transparent' : 'rgba(0, 0, 0, 0.25)')};
`;

const BackDrop = (props) => {
  return (
    <Portal>
      <StyledBackDrop {...props} />
    </Portal>
  );
};

export default BackDrop;
