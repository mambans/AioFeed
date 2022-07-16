import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import AccountContext from '../../account/AccountContext';
import { GoSignOut } from 'react-icons/go';
import ToolTip from '../../../components/tooltip/ToolTip';
import NavigationContext from '../NavigationContext';
import { toast } from 'react-toastify';

const Logout = () => {
  const { signOut } = useContext(AccountContext) || {};
  const { setSidebarComonentKey } = useContext(NavigationContext) || {};

  const logout = async () => {
    const loggedOut = await signOut();
    console.log('loggedOut:', loggedOut);
    setSidebarComonentKey({ comp: 'signin' });
    toast.success(`Successfully signed out`);
  };

  return (
    <ToolTip tooltip='Logout'>
      <Button style={{ width: '100%' }} onClick={logout} variant='secondary'>
        Logout
        <GoSignOut size={24} style={{ marginLeft: '0.75rem' }} />
      </Button>
    </ToolTip>
  );
};
export default Logout;
