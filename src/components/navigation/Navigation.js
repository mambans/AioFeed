import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { github } from "react-icons-kit/icomoon/github";
import Icon from "react-icons-kit";
import { closeCircled } from "react-icons-kit/ionicons/closeCircled";
import Popup from "reactjs-popup";

import HandleRefresh from "./HandleRefresh";
import NotifiesAccount from "../account/NotifiesAccount";
import NotifiesCreateAccount from "../account/NotifiesCreateAccount";
import NotifiesLogin from "../account/NotifiesLogin";
import styles from "./Navigation.module.scss";
import Utilities from "../../utilities/Utilities";
import "./Navigation.scss";

function NavigationBar(data) {
  const [refresh, setRefresh] = useState(false);
  const [loggedIn, setLoggedIn] = useState(Utilities.getCookie("Notifies_AccountName"));
  const [renderModal, setRenderModal] = useState("login");
  const [shrinkNavbar, setShrinkNavbar] = useState("false");

  const openModal = () => {
    data.data.setAccountModalOpen(true);
  };

  const closeModal = () => {
    data.data.setAccountModalOpen(false);
    data.data.setRefresh(!data.data.refresh);
  };

  useEffect(() => {
    setLoggedIn(Utilities.getCookie("Notifies_AccountName"));
    if (data) {
      setRefresh(true);
    }
  }, [data, loggedIn]);

  window.onscroll = function() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      setShrinkNavbar("true");
    } else {
      setShrinkNavbar("false");
    }
  };

  return (
    <Navbar
      mode={data.fixed ? "fixed" : "unset"}
      collapseOnSelect
      expand='lg'
      bg='dark'
      variant='dark'
      shrink={shrinkNavbar}>
      <Nav.Link as={NavLink} to='/' className='logo-link'>
        <img src={`${process.env.PUBLIC_URL}/icons/v3/Logo-4k.png`} alt='logo' className='logo' />
        Notifies
      </Nav.Link>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Container>
          <Nav className='mr-auto'>
            <Nav.Link as={NavLink} to='/feed' activeClassName='active'>
              Feed
            </Nav.Link>
            {/* <Nav.Link as={NavLink} to='/twitch/notifications' activeClassName='active'>
              Webhooks
            </Nav.Link> */}
          </Nav>
        </Container>
        <Nav style={{ justifyContent: "right" }}>
          <NavDropdown title='Other' id='collasible-nav-dropdown'>
            <NavDropdown.Item as={NavLink} to='/account/create' id='login'>
              Create Account
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href='https://github.com/mambans/Notifies'>
              <Icon icon={github} size={24} style={{ paddingRight: "0.75rem" }}></Icon>
              Notifies -Github
            </NavDropdown.Item>
          </NavDropdown>
          <Popup
            open={data.data.accountModalOpen}
            onClose={closeModal}
            trigger={
              <div onClick={openModal} className={styles.navProfileContainer}>
                {loggedIn ? (
                  <img
                    onClick={openModal}
                    className={styles.navProfile}
                    id='NavigationProfileImage'
                    src={
                      Utilities.getCookie("Notifies_AccountProfileImg") !== "null"
                        ? Utilities.getCookie("Notifies_AccountProfileImg")
                        : `${process.env.PUBLIC_URL}/images/placeholder.png`
                    }
                    style={{ marginLeft: "0" }}
                    alt=''></img>
                ) : (
                  <p className={styles.LoginAccountButton}>Login</p>
                )}
              </div>
            }
            // position='center'
            className='accountPopup'>
            {loggedIn ? (
              data.data.accountModalOpen ? (
                <HandleRefresh>
                  {data => (
                    <>
                      <Icon
                        icon={closeCircled}
                        size={56}
                        onClick={closeModal}
                        className={styles.closeModalButton}
                      />
                      <NotifiesAccount
                        data={data}
                        navSetRefresh={setRefresh}
                        navRefresh={refresh}
                        setRenderModal={setRenderModal}></NotifiesAccount>
                    </>
                  )}
                </HandleRefresh>
              ) : (
                // <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
                //   <span className='sr-only'>Loading...</span>
                // </Spinner>
                ""
              )
            ) : (
              <div className={styles.createAccountContainer}>
                {renderModal !== "login" ? (
                  <NotifiesCreateAccount />
                ) : (
                  <>
                    <NotifiesLogin
                      data={data.data}
                      navSetRefresh={setRefresh}
                      setRenderModal={setRenderModal}></NotifiesLogin>
                    <Button
                      className={styles.disconnectButton}
                      onClick={() => {
                        setRenderModal("create");
                      }}>
                      Create Account
                    </Button>
                  </>
                )}
              </div>
            )}
          </Popup>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
