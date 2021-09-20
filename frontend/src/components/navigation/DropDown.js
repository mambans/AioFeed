import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaAngleDown } from 'react-icons/fa';

import { PortalWithState } from 'react-portal';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

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

    &:hover {
      background: rgba(50, 50, 50, 0.7);
      color: #ffffff;
    }
  }
`;

const DropDownTrigger = styled.div`
  width: max-content;
  font-size: 1.15rem;
  cursor: pointer;
  user-select: none;

  svg {
    transition: transform 250ms;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(90deg)')};
  }
`;

const DropdownContainer = ({ triggerRef, close, children }) => {
  const [selfOffets, setSelfOffsets] = useState();
  const [triggerOffset, setTriggerOffset] = useState();
  const ref = useRef();

  useEventListenerMemo('blur', close);

  useEffect(() => {
    setSelfOffsets(ref.current?.getBoundingClientRect());
    setTriggerOffset(triggerRef.current?.getBoundingClientRect());
  }, [triggerRef]);

  return (
    <StyledDropdownContainer
      ref={ref}
      triggerOffset={triggerOffset}
      selfOffets={selfOffets}
      onClick={close}
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
            <DropdownContainer triggerRef={triggerRef} close={closePortal}>
              {children}
            </DropdownContainer>
          )}
        </>
      )}
    </PortalWithState>
  );
};

export default DropDown;
