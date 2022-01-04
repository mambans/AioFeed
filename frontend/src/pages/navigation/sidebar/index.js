import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';

import AccountContext from './../../account/AccountContext';
import CreateAccount from './CreateAccount';
import Login from './Login';
import NavigationContext from './../NavigationContext';
import SidebarAccount from './SidebarAccount';
import { StyledNavSidebarTrigger, StyledLoginButton } from './../StyledComponents';
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from './StyledComponents';
import { Portal } from 'react-portal';

const Sidebar = () => {
  const { profileImage, username, authKey } = useContext(AccountContext);
  const { renderModal, showSidebar, setShowSidebar, overflow } = useContext(NavigationContext);

  const handleToggle = () => setShowSidebar(!showSidebar);

  const modal = {
    account: username && authKey ? <SidebarAccount /> : <Login />,
    login: <Login />,
    create: <CreateAccount />,
  };

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {username && authKey ? (
          <>
            <StyledSidebarTrigger id='NavigationProfileImageHoverOverlay' open={showSidebar} />
            <img
              id='NavigationProfileImage'
              src={profileImage || `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`}
              alt=''
            />
          </>
        ) : (
          <StyledLoginButton>Login</StyledLoginButton>
        )}
      </StyledNavSidebarTrigger>

      <CSSTransition
        in={showSidebar}
        timeout={500}
        classNames='NavSidebarBackdropFade'
        unmountOnExit
      >
        <Portal>
          <StyledNavSidebarBackdrop onClick={() => setShowSidebar(false)} />
        </Portal>
      </CSSTransition>

      <CSSTransition in={showSidebar} timeout={500} classNames='NavSidebarSlideRight' unmountOnExit>
        <Portal>
          <StyledNavSidebar overflow={overflow}>{modal[renderModal]}</StyledNavSidebar>
        </Portal>
      </CSSTransition>
    </>
  );
};

export default Sidebar;
