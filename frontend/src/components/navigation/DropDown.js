import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaAngleDown } from 'react-icons/fa';

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

const DropDownTrigger = styled.div`
  width: max-content;
  font-size: 1.15rem;

  svg {
    transition: transform 250ms;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
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
          <DropDownTrigger
            className='nav-link'
            onClick={(e) => {
              openPortal(e);
              isOpen && triggerRef.current.blur();
            }}
            ref={triggerRef}
            isOpen={isOpen}
            tabIndex='4'
          >
            {title}
            <FaAngleDown size={20} />
          </DropDownTrigger>
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
