import React, { useRef, useState } from 'react';
import { Overlay, Popover as ReactPopover } from 'react-bootstrap';
import styled from 'styled-components';
import useClicksOutside from '../hooks/useClicksOutside';

/**
 *
 * @param {string} [placement = bottom] - 'auto-start' | 'auto' | 'auto-end' | 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-end' | 'bottom' | 'bottom-start' | 'left-end' | 'left' | 'left-start'
 * @returns  JSX
 */
const Popover = ({
  header,
  placement = 'bottom',
  trigger,
  children,
  disabled,
  backgroundColor,
  triggerStyle = {},
}) => {
  const [open, setOpen] = useState();
  const [target, setTarget] = useState();
  const ref = useRef(null);

  const handleToggle = (e) => {
    setOpen((c) => !c);
    setTarget(e.target);
  };
  const handleClose = (e) => {
    setOpen(false);
  };

  useClicksOutside(ref, handleClose, open);

  return (
    <div ref={ref}>
      <Trigger disabled={disabled} onClick={handleToggle} style={triggerStyle}>
        {trigger}
      </Trigger>
      <Overlay
        show={open}
        target={target}
        placement={placement}
        container={ref}
        containerPadding={20}
        onHide={handleClose}
      >
        <StyledReactPopover
          backgroundColor={backgroundColor}
          id={`popover-positioned-${placement}`}
        >
          {header && <StyledReactPopover.Header as='h3'>{header}</StyledReactPopover.Header>}
          <StyledReactPopover.Body>{children}</StyledReactPopover.Body>
        </StyledReactPopover>
      </Overlay>
    </div>
  );
};
export default Popover;

const Trigger = styled.span`
  cursor: ${({ disabled }) => (disabled ? 'unset' : 'pointer')};
  transition: opacity 500ms;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledReactPopover = styled(ReactPopover)`
  --bs-popover-bg: ${({ backgroundColor }) => backgroundColor || 'rgba(20, 20, 20, 0.92)'};
`;
