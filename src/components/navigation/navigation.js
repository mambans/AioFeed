import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Icon from "react-icons-kit";
import { github } from "react-icons-kit/icomoon/github";

import "./Navigation.scss";
import Utilities from "../../utilities/Utilities";
import placeholder from "../../assets/images/placeholder.png";
import styles from "./Navigation.module.scss";

function NavigationBar(data) {
  //eslint-disable-next-line
  const [refresh, setRefresh] = useState(false);
  const [loggedIn, setLoggedIn] = useState(Utilities.getCookie("Notifies_AccountName"));

  useEffect(() => {
    setLoggedIn(Utilities.getCookie("Notifies_AccountName"));
    if (data) {
      setRefresh(true);
    }
  }, [data, loggedIn]);

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Nav.Link as={NavLink} to='/' className='logo-link'>
        <img src={`${process.env.PUBLIC_URL}/icons/v3/Logo-4k.png`} alt='logo' className='logo' />
        Notifies
      </Nav.Link>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Container>
          <Nav className='mr-auto'>
            <Nav.Link as={NavLink} to='/feed' activeClassName='active'>
              {/* <Icon icon={feed} size={24} style={{ paddingRight: "0.75rem" }}></Icon> */}
              Feed
            </Nav.Link>
            <Nav.Link as={NavLink} to='/twitch/notifications' activeClassName='active'>
              Webhooks
            </Nav.Link>
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
          {loggedIn ? (
            <Nav.Link as={NavLink} to={`/account`}>
              <img
                className={styles.navProfile}
                src={
                  Utilities.getCookie("Notifies_AccountProfileImg") !== "null"
                    ? Utilities.getCookie("Notifies_AccountProfileImg")
                    : placeholder
                }
                alt=''></img>
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={NavLink} to={`/account/create`}>
                Create account
              </Nav.Link>
              <Nav.Link as={NavLink} to={`/account/login`}>
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
