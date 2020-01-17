import React, { useState, useContext } from "react";
import { CSSTransition } from "react-transition-group";

import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import CreateAccount from "./CreateAccount";
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from "./StyledComponent";
import Login from "./Login";
import SidebarAccount from "./SidebarAccount";
import { StyledNavSidebarTrigger, StyledLoginButton } from "./../StyledComponents";

export default props => {
  const [show, setShow] = useState(false);
  const { profileImage } = useContext(AccountContext);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {props.isLoggedIn ? (
          <>
            <StyledSidebarTrigger />
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
        <FeedsContext.Consumer>
          {feedsProps => {
            return (
              <StyledNavSidebar>
                {props.isLoggedIn ? (
                  <SidebarAccount
                    {...feedsProps}
                    {...props}
                    setRenderModal={props.setRenderModal}
                  />
                ) : props.renderModal === "create" ? (
                  <CreateAccount />
                ) : (
                  <Login />
                )}
              </StyledNavSidebar>
            );
          }}
        </FeedsContext.Consumer>
      </CSSTransition>
    </>
  );
};
