import React, { useContext } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FaGithub } from "react-icons/fa";

import RenderNotifications from "./../notifications";
import NavigationContext from "./NavigationContext";
import "./Navigation.scss";
import Sidebar from "./sidebar";

export default (prop) => {
  const { visible, shrinkNavbar } = useContext(NavigationContext);

  return (
    <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
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
          AioFeed
        </Nav.Link>
        <RenderNotifications />
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Container>
            <Nav className='mr-auto'>
              <Nav.Link as={NavLink} to='/feed/' activeClassName='active'>
                Feed
              </Nav.Link>
              <Nav.Link as={NavLink} to='/game/' activeClassName='active'>
                Top streams
              </Nav.Link>
            </Nav>
          </Container>
          <Nav style={{ justifyContent: "right" }}>
            <NavDropdown title='Other' id='collasible-nav-dropdown'>
              <NavDropdown.Item href='https://github.com/mambans/AioFeed'>
                <FaGithub size={24} style={{ marginRight: "0.75rem" }} />
                AioFeed-Github
              </NavDropdown.Item>
            </NavDropdown>
            <Sidebar />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </CSSTransition>
  );
};
