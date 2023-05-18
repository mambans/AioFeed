import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useClicksOutside from '../../hooks/useClicksOutside';

const Container = styled.div`
  margin: auto 15px;
`;

const Dropdown = styled.div`
  position: absolute;
  z-index: 1;
  /* background: background: var(--popupListsBackground); */
  background: var(--popupListsBackground);
  padding: 5px 10px;

  p {
    display: flex;
    align-items: center;
  }

  & > div {
    padding: 5px 0;
  }
`;

const DropDownSimple = ({ children, trigger }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();

  useClicksOutside([ref, dropdownRef], () => setOpen(false), open);

  return (
    <Container ref={ref}>
      <span onClick={() => setOpen((c) => !c)}>{trigger}</span>

      {open && <Dropdown ref={dropdownRef}>{children}</Dropdown>}
    </Container>
  );
};

export default DropDownSimple;
