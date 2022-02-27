import React, { useRef, useState } from 'react';
import styled from 'styled-components';
// import useClicksInside from '../../../hooks/useClicksInside';
// import useClicksOutside from '../../../hooks/useClicksOutside';

const Container = styled.div`
  transform: ${({ open }) => (open ? 'translateY(0px) !important' : 'translateY(50%)')};
  opacity: ${({ open }) => (open ? '1 !important' : '0')};
  pointer-events: ${({ open }) => (open ? 'all !important' : 'none')};
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
  gap: 3px;

  backdrop-filter: blur(10px);
  padding:3px:
  border-radius: 3px;

  button,
  svg {
    opacity: ${({ open }) => (open ? '1 !important' : '0')};
    display: flex;
    align-content: center;
    align-items: center;
  }

  &&& {
    button,
    a {
      margin: 0;
    }
  }

  &:focus-within {
    transform: translateY(0px) !important;
    opacity: 1 !important;
  }
`;

const ChannelButtonsContainer = ({ children, className, forceOpen, style, staticOpen }) => {
  const ref = useRef();
  const [open, setOpen] = useState(forceOpen);
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setOpenParent: setOpen, openParent: open, size: '1.5em' });
    }
    return child;
  });

  // useClicksInside(ref, () => setOpen(true));
  // useClicksOutside(ref, () => setOpen(false));

  return (
    <Container ref={ref} open={staticOpen || open} className={className} style={style}>
      {childrenWithProps}
    </Container>
  );
};
export default ChannelButtonsContainer;
