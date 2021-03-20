import React, { useState } from 'react';
import styled from 'styled-components';
import { MdFormatListBulleted } from 'react-icons/md';
import DeleteListBtn from './DeleteListBtn';
import CopyListBtn from './CopyListBtn';

const Container = styled.div`
  margin: auto 15px;
`;

const TriggerBtn = styled.button`
  color: ${({ open }) => (open ? ' rgb(255, 255, 255)' : 'rgb(150, 150, 150)')};
  transition: color 250ms;
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  padding: 5px;
  border-radius: 5px;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  z-index: 1;
  /* background: background: var(--popupListsBackground); */
  background: var(--refreshButtonBackground);
  padding: 3px;

  p {
    display: flex;
    align-items: center;
  }
`;

export default ({ list }) => {
  const [open, setOpen] = useState();

  return (
    <Container>
      <TriggerBtn open={open} onClick={() => setOpen((c) => !c)}>
        <MdFormatListBulleted size={24} />
      </TriggerBtn>

      {open && (
        <Dropdown>
          <CopyListBtn list={list}>Copy</CopyListBtn>
          <DeleteListBtn list={list}>Delete</DeleteListBtn>
        </Dropdown>
      )}
    </Container>
  );
};
