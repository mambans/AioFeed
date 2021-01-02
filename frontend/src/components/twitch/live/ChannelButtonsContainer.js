import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useClicksInside from '../../../hooks/useClicksInside';
import useClicksOutside from '../../../hooks/useClicksOutside';

const Container = styled.div`
  /* &&& { */
  transform: ${({ open }) => (open ? 'translateX(0px) !important' : 'translateX(250px)')};
  opacity: ${({ open }) => (open ? '1 !important' : '0')};
  /* } */

  &:focus-within {
    transform: translateX(0px) !important;
    opacity: 1 !important;
  }
`;

export default ({ children, className, forceOpen }) => {
  const ref = useRef();
  const [open, setOpen] = useState(forceOpen);

  useClicksInside(ref, () => {
    setOpen(true);
  });

  useClicksOutside(ref, () => {
    setOpen(false);
  });

  return (
    <Container ref={ref} open={open} className={className}>
      {children}
    </Container>
  );
};
