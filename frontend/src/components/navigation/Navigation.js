import React, { useState, useContext } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { github } from "react-icons-kit/icomoon/github";
import Icon from "react-icons-kit";
import { CSSTransition } from "react-transition-group";

import RenderNotifications from "./../notifications/RenderNotifications";
import NavigationContext from "./NavigationContext";
import "./Navigation.scss";
import Sidebar from "./sidebar/Sidebar";

function NavigationBar(prop) {
  const [refresh, setRefresh] = useState(false);
  // eslint-disable-next-line

  const { visible, shrinkNavbar } = useContext(NavigationContext);

  return (
    <CSSTransition in={visible} timeout={1000} classNames='fade-300ms' unmountOnExit>
      <Navbar
        mode={prop.fixed ? "fixed" : "unset"}
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
        shrink={shrinkNavbar}>
        <Nav.Link as={NavLink} to='/' className='logo-link'>
          <img
            src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`}
            alt='logo'
            className='logo'
          />
          Notifies
        </Nav.Link>
        <RenderNotifications />
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Container>
            <Nav className='mr-auto'>
              <Nav.Link as={NavLink} to='/feed/' activeClassName='active'>
                Feed
              </Nav.Link>
              <Nav.Link as={NavLink} to='/twitch/top/' activeClassName='active'>
                Top streams
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
            <NavigationContext.Consumer>
              {props => {
                return <Sidebar {...props} refresh={refresh} setRefresh={setRefresh} />;
              }}
            </NavigationContext.Consumer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </CSSTransition>
  );
}

export default NavigationBar;
