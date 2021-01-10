import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useClicksInside from '../../../hooks/useClicksInside';
import useClicksOutside from '../../../hooks/useClicksOutside';

const Container = styled.div`
  /* &&& { */
  transform: ${({ open }) => (open ? 'translateY(0px) !important' : 'translateY(50%)')};
  opacity: ${({ open }) => (open ? '1 !important' : '0')};
  /* } */

  &:focus-within {
    transform: translateY(0px) !important;
    opacity: 1 !important;
  }
`;

export default ({ children, className, forceOpen }) => {
  const ref = useRef();
  const [open, setOpen] = useState(forceOpen);

  useClicksInside(ref, () => setOpen(true));

  useClicksOutside(ref, () => setOpen(false));

  return (
    <Container ref={ref} open={open} className={className}>
      {children}
    </Container>
  );
};
