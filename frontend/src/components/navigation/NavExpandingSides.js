import React from 'react';
import { Nav } from 'react-bootstrap';
import styled from 'styled-components';

const NavExpandingSidesContainer = styled(Nav)`
  min-width: 400px;
  align-items: center;
  justify-content: ${({ side }) => (side === 'right' ? 'flex-end' : 'start')};
  z-index: 5;
`;

const NavExpandingSides = styled.div`
  border-radius: ${({ side }) => (side === 'right' ? '25px 0 0 25px' : '0 25px 25px 0')};
  width: 275px;
  transition: width 250ms cubic-bezier(0.46, 0.03, 0.52, 0.96);
  height: inherit;
  overflow: hidden;
  background: var(--navigationbarBackground) !important;
  display: flex;
  justify-content: ${({ side }) => (side === 'right' ? 'end' : 'start')};
  align-items: center;
  position: relative;

  #arrow {
    position: absolute;
    left: ${({ side }) => (side === 'right' ? 'unset' : 'calc(100% - 25px)')};
    right: ${({ side }) => (side === 'left' ? 'unset' : 'calc(100% - 25px)')};
    opacity: 0.5;
    transition: opacity 250ms;
  }

  &:hover,
  &:focus {
    width: 100%;

    #arrow {
      opacity: 0;
    }
  }
`;

export default React.forwardRef(({ children, side }, ref) => {
  return (
    <NavExpandingSidesContainer side={side}>
      <NavExpandingSides side={side} ref={ref}>
        {children}
      </NavExpandingSides>
    </NavExpandingSidesContainer>
  );
});
