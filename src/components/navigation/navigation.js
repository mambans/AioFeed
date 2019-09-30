import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav, Container, Button } from "react-bootstrap";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";

import Icon from "react-icons-kit";
import { github } from "react-icons-kit/icomoon/github";

import "./Navigation.scss";
import logo from "../../assets/images/logo-v2.png";
import Home from "./../home/Home";
import Feed from "./../feed/Feed";
import youtubeAuth from "./../auth/YoutubeAuth";
import TwitchAuth from "./../auth/TwitchAuth";
import ErrorHandeling from "./../error/Error";
import Utilities from "./../../utilities/Utilities";
import NotifiesCreateAccount from "./../account/NotifiesCreateAccount";
import NotifiesLogin from "./../account/NotifiesLogin";
import NotifiesAccount from "./../account/NotifiesAccount";
import placeholder from "./../../assets/images/placeholder.png";
import styles from "./Navigation.module.scss";
import NoMatch from "./NoMatch.js";
import YoutubeNewVideo from "./../youtube/YoutubeNewVideo";

import streamOnlineWebhook from "./../twitch/Twitchwebhooks";

function Navigation() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/index' component={Home} />
        <Route exact path='/home' component={Home} />
        <Route
          path='/feed'
          render={() =>
            Utilities.getCookie("Notifies_AccountName") ? (
              <Feed />
            ) : (
              <>
                <ErrorHandeling
                  data={{
                    title: "Please login",
                    message: "You are not logged with your Notifies account.",
                  }}></ErrorHandeling>
                <Button className={styles.notifiesLogin} as={NavLink} to='/account/login'>
                  Login
                </Button>
              </>
            )
          }
        />
        <Route path='/twitch/notifications' component={streamOnlineWebhook} />
        <Route path='/youtube/notifications' component={YoutubeNewVideo} />
        {/* <Route path="/twitch/notifications/callback" component={} /> */}
        <Route path='/youtube/login' component={youtubeAuth} />
        <Route path='/login' component={TwitchAuth} />
        <Route path='/twitch/auth' component={TwitchAuth} />
        <Route path='/youtube/auth' component={youtubeAuth} />

        <Route path='/account/create' component={NotifiesCreateAccount} />
        <Route path='/account/login' component={NotifiesLogin} />
        <Route path='/account' component={NotifiesAccount} />

        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

function NavigationBar() {
  const [loggedIn, setLoggedIn] = useState(Utilities.getCookie("Notifies_AccountName"));

  useEffect(() => {
    setLoggedIn(Utilities.getCookie("Notifies_AccountName"));
  }, [loggedIn]);

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Nav.Link as={NavLink} to='/' className='logo-link'>
        <img src={logo} alt='logo' className='logo' />
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
        <Nav>
          <NavDropdown title='Other' id='collasible-nav-dropdown'>
            <NavDropdown.Item as={NavLink} to='/account/create' id='login'>
              Create Account
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/account/login' id='login'>
              Login with Notifies
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href='https://github.com/mambans/Notifies'>
              <Icon icon={github} size={24} style={{ paddingRight: "0.75rem" }}></Icon>
              Notifies -Github
            </NavDropdown.Item>
          </NavDropdown>
          {loggedIn ? (
            <Nav.Link as={NavLink} to={`/account`}>
              <img className={styles.navProfile} src={placeholder} alt=''></img>
            </Nav.Link>
          ) : (
            <Nav.Link as={NavLink} to={`/account/login`}>
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Navigation;
