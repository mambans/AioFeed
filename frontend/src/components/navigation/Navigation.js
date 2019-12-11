import React, { useState } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { github } from "react-icons-kit/icomoon/github";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import "./Navigation.scss";

import { ic_notifications_none } from "react-icons-kit/md/ic_notifications_none";
import { ic_notifications_active } from "react-icons-kit/md/ic_notifications_active";
import { ButtonList } from "./../sharedStyledComponents";
import RenderNotifications from "./../notifications/RenderNotifications";
import NotificationsContext from "./../notifications/NotificationsContext";
import AccountButton from "./AccountButton";
import NavigationContext from "./NavigationContext";
import { UnseenNotifcationCount } from "./../notifications/styledComponent";

function NavigationBar(prop) {
  const [refresh, setRefresh] = useState(false);
  const [shrinkNavbar, setShrinkNavbar] = useState("false");

  window.onscroll = function() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      setShrinkNavbar("true");
    } else {
      setShrinkNavbar("false");
    }
  };

  return (
    <Navbar
      mode={prop.fixed ? "fixed" : "unset"}
      collapseOnSelect
      expand='lg'
      bg='dark'
      variant='dark'
      shrink={shrinkNavbar}>
      <Nav.Link as={NavLink} to='/' className='logo-link'>
        <img src={`${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`} alt='logo' className='logo' />
        Notifies
      </Nav.Link>

      <NotificationsContext.Consumer>
        {props => {
          return (
            <Popup
              placeholder='""'
              arrow={false}
              lockScroll={true}
              className='Notifications'
              onOpen={() => {
                props.clearUnseenNotifications();
                // props.enableNotificationIndicator(false);
              }}
              trigger={
                <ButtonList
                  style={{ border: "none", background: "none", boxShadow: "none", padding: "0" }}>
                  {props.unseenNotifications &&
                  Array.isArray(props.unseenNotifications) &&
                  props.unseenNotifications.length > 0 ? (
                    // {/* {props.notificationIndicator ? ( */}
                    <>
                      <Icon
                        icon={ic_notifications_active}
                        size={40}
                        style={{
                          color: "var(--newHighlight)",
                          height: "22px",
                          alignItems: "center",
                          display: "flex",
                          transition: "ease-in-out 1s",
                        }}></Icon>
                      <UnseenNotifcationCount>
                        {props.unseenNotifications.length}
                      </UnseenNotifcationCount>
                    </>
                  ) : (
                    <Icon
                      icon={ic_notifications_none}
                      size={40}
                      style={{
                        alignItems: "center",
                        display: "flex",
                        ransition: "ease-in-out 1s",
                      }}></Icon>
                  )}
                </ButtonList>
              }
              position='right top'
              // className='popupModal'
            >
              <RenderNotifications {...props} />
            </Popup>
          );
        }}
      </NotificationsContext.Consumer>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Container>
          <Nav className='mr-auto'>
            <Nav.Link as={NavLink} to='/feed' activeClassName='active'>
              Feed
            </Nav.Link>
            <Nav.Link as={NavLink} to='/twitch/top' activeClassName='active'>
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
              return (
                <AccountButton {...props} refresh={refresh} setRefresh={setRefresh}></AccountButton>
              );
            }}
          </NavigationContext.Consumer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
