import React, { useRef, useState } from 'react';
import styled from 'styled-components';
// import useClicksInside from '../../../hooks/useClicksInside';
// import useClicksOutside from '../../../hooks/useClicksOutside';

const Container = styled.div`
  transform: ${({ open }) => (open ? 'translateY(0px) !important' : 'translateY(50%)')};
  opacity: ${({ open }) => (open ? '1 !important' : '0')};
  pointer-events: ${({ open }) => (open ? 'all !important' : 'none')};

  button,
  svg {
    opacity: ${({ open }) => (open ? '1 !important' : '0')};
  }

  &:focus-within {
    transform: translateY(0px) !important;
    opacity: 1 !important;
  }
`;

export default ({ children, className, forceOpen, style, staticOpen }) => {
  const ref = useRef();
  const [open, setOpen] = useState(forceOpen);
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setOpenParent: setOpen, openParent: open });
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
