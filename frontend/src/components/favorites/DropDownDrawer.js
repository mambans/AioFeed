import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { MdEdit } from 'react-icons/md';
import DeleteListBtn from './DeleteListBtn';
import CopyListBtn from './CopyListBtn';
import { ButtonLookalikeStyle } from '../sharedComponents/sharedStyledComponents';
import useClicksOutside from '../../hooks/useClicksOutside';

const Container = styled.div`
  margin: auto 15px;
`;

const TriggerBtn = styled.button`
  ${ButtonLookalikeStyle}
  color: ${({ open }) => (open ? 'rgb(255, 255, 255)' : 'rgb(150, 150, 150)')};
  width: ${({ open }) => (open ? '100px' : '36px')};
  transition: color 250ms, width 250ms;
  padding: 5px;
  padding-left: ${({ open }) => (open ? '10px' : '5px')};
  text-align: left;
`;

const Dropdown = styled.div`
  position: absolute;
  z-index: 1;
  /* background: background: var(--popupListsBackground); */
  background: var(--refreshButtonBackground);
  padding: 5px 10px;

  p {
    display: flex;
    align-items: center;
  }

  & > div {
    padding: 5px 0;
  }
`;

const DropDownDrawer = ({ list }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();

  useClicksOutside([ref, dropdownRef], () => setOpen(false), open);

  return (
    <Container ref={ref}>
      <TriggerBtn open={open} onClick={() => setOpen((c) => !c)}>
        <MdEdit size={24} />
      </TriggerBtn>

      {open && (
        <Dropdown ref={dropdownRef}>
          <CopyListBtn list={list}>Copy</CopyListBtn>
          <DeleteListBtn list={list}>Delete</DeleteListBtn>
        </Dropdown>
      )}
    </Container>
  );
};

export default DropDownDrawer;
