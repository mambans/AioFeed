import React, { useEffect, useRef, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';

import { PortalWithState } from 'react-portal';

const StyledDropdownContainer = styled.div`
  position: fixed;
  left: ${({ triggerOffset, selfOffets }) =>
    triggerOffset?.left - (selfOffets?.width - triggerOffset?.width) / 2}px;
  top: ${({ triggerOffset }) => triggerOffset?.bottom}px;
  background: var(--navigationbarBackground);
  border-radius: 10px;
  z-index: 2;
  padding-top: 8px;

  a {
    color: var(--navTextColor);

    &:last-child {
      border-radius: 0 0 10px 10px;
    }

    svg {
      margin-right: 5px;
    }
  }
`;

const DropdownContainer = ({ triggerRef, onClick, children }) => {
  const [selfOffets, setSelfOffsets] = useState();
  const [triggerOffset, setTriggerOffset] = useState();
  const ref = useRef();

  useEffect(() => {
    setSelfOffsets(ref.current?.getBoundingClientRect());
    setTriggerOffset(triggerRef.current?.getBoundingClientRect());
  }, [triggerRef]);

  return (
    <StyledDropdownContainer
      ref={ref}
      triggerOffset={triggerOffset}
      selfOffets={selfOffets}
      onClick={onClick}
    >
      {children}
    </StyledDropdownContainer>
  );
};

const DropDown = ({ title, children }) => {
  const triggerRef = useRef();

  return (
    <PortalWithState closeOnOutsideClick closeOnEsc>
      {({ openPortal, closePortal, isOpen, portal }) => (
        <>
          <NavDropdown title={title} onClick={openPortal} ref={triggerRef} />
          {portal(
            <DropdownContainer triggerRef={triggerRef} onClick={closePortal}>
              {children}
            </DropdownContainer>
          )}
        </>
      )}
    </PortalWithState>
  );
};

export default DropDown;
