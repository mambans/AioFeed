import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';

import AccountContext from './../../account/AccountContext';
import NavigationContext from './../NavigationContext';
import SidebarAccount from './SidebarAccount';
import { StyledNavSidebarTrigger, StyledLoginButton } from './../StyledComponents';
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from './StyledComponents';
import { Portal } from 'react-portal';
import LoadingIndicator from '../../../components/LoadingIndicator';
import SignUp from '../../account/SignUp';
import SignIn from '../../account/SignIn';
import ForgotPassword from '../../account/ForgotPassword';
import { useRecoilState, useRecoilValue } from 'recoil';
import { navigationSidebarAtom, navigationSidebarOverflowAtom } from '../atoms';

const NavigationSidebar = () => {
  const { user, loading } = useContext(AccountContext);
  const { sidebarComonentKey } = useContext(NavigationContext);
  const [showSidebar, setShowNavigationSidebar] = useRecoilState(navigationSidebarAtom);
  const navigationSidebarOverflow = useRecoilValue(navigationSidebarOverflowAtom);

  const handleToggle = () => setShowNavigationSidebar((c) => !c);

  const component = (() => {
    if (user) return <SidebarAccount />;
    switch (sidebarComonentKey?.comp?.toLowerCase()) {
      case 'signup':
        return <SignUp text={sidebarComonentKey?.text} />;
      case 'forgotpassword':
        return <ForgotPassword text={sidebarComonentKey?.text} />;
      case 'signin':
        return <SignIn text={sidebarComonentKey?.text} />;
      case 'account':
      default:
        return user ? (
          <SidebarAccount text={sidebarComonentKey?.text} />
        ) : (
          <SignIn text={sidebarComonentKey?.text} />
        );
    }
  })();

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {user ? (
          <>
            <StyledSidebarTrigger id='NavigationProfileImageHoverOverlay' open={showSidebar} />
            <img
              id='NavigationProfileImage'
              src={`${process.env.PUBLIC_URL}/images/webp/placeholder.webp`}
              alt=''
            />
          </>
        ) : loading ? (
          <LoadingIndicator height={32} width={32} />
        ) : (
          <StyledLoginButton>Login</StyledLoginButton>
        )}
      </StyledNavSidebarTrigger>

      <CSSTransition
        in={showSidebar}
        timeout={500}
        classNames='NavSidebarBackdropFade'
        unmountOnExit
        appear
      >
        <Portal>
          <StyledNavSidebarBackdrop onClick={() => setShowNavigationSidebar(false)} />
        </Portal>
      </CSSTransition>

      <CSSTransition
        in={showSidebar}
        timeout={500}
        classNames='NavSidebarSlideRight'
        unmountOnExit
        appear
      >
        <Portal>
          <StyledNavSidebar overflow={navigationSidebarOverflow}>{component}</StyledNavSidebar>
        </Portal>
      </CSSTransition>
    </>
  );
};

export default NavigationSidebar;
