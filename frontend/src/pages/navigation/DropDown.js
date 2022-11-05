import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaAngleDown } from 'react-icons/fa';

import { PortalWithState } from 'react-portal';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { ListActionButton } from '../myLists/StyledComponents';

const StyledDropdownContainer = styled.div`
  position: fixed;
  left: ${({ triggerOffset, selfOffets }) =>
    triggerOffset?.left - (selfOffets?.width / 2 - triggerOffset?.width / 2)}px;
  top: ${({ triggerOffset }) => triggerOffset?.bottom}px;
  background: var(--navigationbarBackground);
  border-radius: 10px;
  z-index: 2;
  padding-top: 8px;
  /* width: ${({ triggerOffset }) => triggerOffset?.width}px; */
  /* top: ${({ height }) => `calc(50% - (${height || '600px'} / 2))`}; */
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
    transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
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

/**
 *
 * @param {Array} items = ({icon, title, onClick})
 * @returns
 */

const DropDown = ({ title, trigger, children, items, hoverEnabled, showArrow = true }) => {
  const triggerRef = useRef();

  return (
    <PortalWithState closeOnOutsideClick closeOnEsc>
      {({ openPortal, closePortal, isOpen, portal }) => {
        const hoverEvents = {
          onMouseEnter: (e) => {
            if (!hoverEnabled) return;
            triggerRef.current.focus();
            openPortal(e);
          },
          onMouseLeave: (e) => {
            if (!hoverEnabled) return;
            closePortal(e);
            triggerRef.current.blur();
          },
        };

        return (
          <div {...hoverEvents} tabIndex='5'>
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
              {trigger || title}
              {showArrow && <FaAngleDown size={20} />}
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
                {items?.map(({ title, icon, onClick, color }) => {
                  return (
                    <ListActionButton color={color} onClick={onClick}>
                      {icon}
                      {title}
                    </ListActionButton>
                  );
                })}
                {children}
              </DropdownContainer>
            )}
          </div>
        );
      }}
    </PortalWithState>
  );
};

export default DropDown;
