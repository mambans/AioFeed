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

const Sidebar = () => {
  const { profileImage, username, authKey } = useContext(AccountContext);
  const { renderModal, showSidebar, setShowSidebar } = useContext(NavigationContext);

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
        <StyledNavSidebarBackdrop onClick={() => setShowSidebar(false)} />
      </CSSTransition>

      <CSSTransition in={showSidebar} timeout={500} classNames='NavSidebarSlideRight' unmountOnExit>
        <StyledNavSidebar>{modal[renderModal]}</StyledNavSidebar>
      </CSSTransition>
    </>
  );
};

export default Sidebar;
