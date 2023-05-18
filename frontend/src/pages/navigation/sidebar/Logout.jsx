import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import AccountContext from '../../account/AccountContext';
import { GoSignOut } from 'react-icons/go';
import ToolTip from '../../../components/tooltip/ToolTip';
import { useSetRecoilState } from 'recoil';
import { navigationSidebarComponentKeyAtom } from '../atoms';

const Logout = () => {
  const { signOut } = useContext(AccountContext) || {};
  const setNavigationSidebarComponentKey = useSetRecoilState(navigationSidebarComponentKeyAtom);

  const logout = async () => {
    const loggedOut = await signOut();
    console.log('loggedOut:', loggedOut);
    setNavigationSidebarComponentKey({ comp: 'signin' });
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
