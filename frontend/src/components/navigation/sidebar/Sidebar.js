import React, { useState, useContext } from "react";
import { CSSTransition } from "react-transition-group";

import AccountContext from "./../../account/AccountContext";
import CreateAccount from "./CreateAccount";
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from "./StyledComponent";
import Login from "./Login";
import SidebarAccount from "./SidebarAccount";
import { StyledNavSidebarTrigger, StyledLoginButton } from "./../StyledComponents";
import NavigationContext from "./../NavigationContext";

export default () => {
  const [show, setShow] = useState(false);
  const { profileImage, username } = useContext(AccountContext);
  const { setRenderModal, renderModal } = useContext(NavigationContext);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {username ? (
          <>
            <StyledSidebarTrigger id='NavigationProfileImageHoverOverlay' />
            <img
              id='NavigationProfileImage'
              src={
                profileImage !== null
                  ? profileImage
                  : `${process.env.PUBLIC_URL}/images/placeholder.jpg`
              }
              alt=''
            />
          </>
        ) : (
          <StyledLoginButton>Login</StyledLoginButton>
        )}
      </StyledNavSidebarTrigger>

      <CSSTransition in={show} timeout={500} classNames='fade-05s' unmountOnExit>
        <StyledNavSidebarBackdrop
          onClick={() => {
            setShow(false);
          }}
        />
      </CSSTransition>

      <CSSTransition in={show} timeout={1000} classNames='fadeSlide-right-1s' unmountOnExit>
        <StyledNavSidebar>
          {username ? (
            <SidebarAccount setRenderModal={setRenderModal} />
          ) : renderModal === "create" ? (
            <CreateAccount />
          ) : (
            <Login />
          )}
        </StyledNavSidebar>
      </CSSTransition>
    </>
  );
};
