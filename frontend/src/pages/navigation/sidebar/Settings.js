import React from 'react';
import Logout from './Logout';
import { MdSettings } from 'react-icons/md';
import styled from 'styled-components';
import ClearAllLocalstorage from './ClearAllLocalstorage';
import EditAccount from './EditAccount';
import Popover from '../../../components/Popover';

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

    button {
      margin: 0;
    }
  }
`;

const Settings = ({ children }) => {
  return (
    <Popover
      placement='left'
      trigger={
        <span>
          <MdSettings size={30} />
        </span>
      }
    >
      <Container>
        {/* <DeleteAccountButton /> */}
        {/* <ChangePassword /> */}
        <EditAccount />
        <ClearAllLocalstorage />
        <Logout />
        {children}
      </Container>
    </Popover>
  );
};
export default Settings;
