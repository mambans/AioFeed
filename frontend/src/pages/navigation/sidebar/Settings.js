import React, { useRef } from 'react';
import DeleteAccountButton from './DeleteAccountButton';
import ChangePassword from './ChangePassword';
import Logout from './Logout';
import MyModal from '../../../components/mymodal/MyModal';
import { MdSettings } from 'react-icons/md';
import styled from 'styled-components';
import ClearAllLocalstorage from './ClearAllLocalstorage';

const Container = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &&& {
    & > * {
      width: 100%;
      min-width: 100%;
    }
  }
`;

const Settings = ({ children }) => {
  const ref = useRef();
  return (
    <MyModal
      direction='left'
      trigger={
        <div ref={ref}>
          <MdSettings size={30} />
        </div>
      }
      style={{
        right: '70px',
        bottom: '10px',
        position: 'fixed',
      }}
    >
      <Container>
        <DeleteAccountButton />
        <ChangePassword />
        <ClearAllLocalstorage />
        <Logout />
        {children}
      </Container>
    </MyModal>
  );
};
export default Settings;