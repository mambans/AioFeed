import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import CreateAccount from "./CreateAccount";
import styles from "./../Navigation.module.scss";
import Utilities from "../../../utilities/Utilities";
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from "./styledComponent";
import Login from "./Login";
import SidebarAccount from "./SidebarAccount";

export default props => {
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <>
      <div onClick={handleToggle} className={styles.navProfileContainer} title='Sidebar'>
        {props.isLoggedIn ? (
          <>
            <StyledSidebarTrigger />
            <img
              // onClick={handleToggle}
              className={styles.navProfile}
              id='NavigationProfileImage'
              src={
                Utilities.getCookie("Notifies_AccountProfileImg") !== null
                  ? Utilities.getCookie("Notifies_AccountProfileImg")
                  : `${process.env.PUBLIC_URL}/images/placeholder.png`
              }
              style={{ marginLeft: "0" }}
              alt=''
            />
          </>
        ) : (
          <p className={styles.LoginAccountButton}>Login</p>
        )}
      </div>

      <CSSTransition in={show} timeout={500} classNames='fade-05s' unmountOnExit>
        <StyledNavSidebarBackdrop
          onClick={() => {
            setShow(false);
          }}
        />
      </CSSTransition>

      <CSSTransition in={show} timeout={1000} classNames='fadeSlide-right-1s' unmountOnExit>
        <AccountContext.Consumer>
          {accProps => {
            return (
              <FeedsContext.Consumer>
                {feedsProps => {
                  return (
                    <StyledNavSidebar>
                      {props.isLoggedIn ? (
                        <SidebarAccount
                          {...accProps}
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
            );
          }}
        </AccountContext.Consumer>
      </CSSTransition>
    </>
  );
};
