import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { MdEdit } from 'react-icons/md';
import DeleteListBtn from './DeleteListBtn';
import CopyListBtn from './CopyListBtn';
import { ButtonLookalikeStyle } from '../../components/styledComponents';
import useClicksOutside from '../../hooks/useClicksOutside';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ListActionButton } from './StyledComponents';

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
  background: ${({ open }) =>
    open ? 'var(--popupListsBackground)' : 'var(--refreshButtonBackground)'};
  text-align: left;
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

const DropDownDrawer = ({ list, toggleList }) => {
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

          <ListActionButton onClick={() => toggleList(list.id)}>
            {list.enabled ? (
              <>
                <AiFillEye size={22} color='#ffffff' />
                Visible
              </>
            ) : (
              <>
                <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                Hidden
              </>
            )}
          </ListActionButton>
        </Dropdown>
      )}
    </Container>
  );
};

export default DropDownDrawer;
