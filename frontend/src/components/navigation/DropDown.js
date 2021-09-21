import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaAngleDown } from 'react-icons/fa';

import { PortalWithState } from 'react-portal';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

const StyledDropdownContainer = styled.div`
  position: fixed;
  left: ${({ triggerOffset, selfOffets }) => triggerOffset?.left}px;
  top: ${({ triggerOffset }) => triggerOffset?.bottom}px;
  background: var(--navigationbarBackground);
  border-radius: 10px;
  z-index: 2;
  padding-top: 8px;
  width: ${({ triggerOffset }) => triggerOffset?.width}px;

  a {
    color: var(--navTextColor);
    /* padding-left: 25px;
    padding-right: 25px; */

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
  outline: none;

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
        <div
          onMouseEnter={(e) => {
            triggerRef.current.focus();
            openPortal(e);
          }}
          onMouseLeave={(e) => {
            closePortal(e);
            triggerRef.current.blur();
          }}
          tabIndex='5'
        >
          <DropDownTrigger
            className='nav-link'
            onClick={(e) => {
              if (isOpen) {
                closePortal(e);
                triggerRef.current.blur();
                return;
              }
              openPortal(e);
            }}
            ref={triggerRef}
            isOpen={isOpen}
            tabIndex='4'
          >
            {title}
            <FaAngleDown size={20} />
          </DropDownTrigger>
          {portal(
            <DropdownContainer
              triggerRef={triggerRef}
              close={closePortal}
              onMouseEnter={(e) => {
                triggerRef.current.focus();
                openPortal(e);
              }}
            >
              {children}
            </DropdownContainer>
          )}
        </div>
      )}
    </PortalWithState>
  );
};

export default DropDown;
