import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import Icon from "react-icons-kit";
import { github } from "react-icons-kit/icomoon/github";

import "./Navigation.scss";
import HandleRefresh from "./HandleRefresh";
import Home from "./../home/Home";
import Feed from "./../feed/Feed";
import YoutubeAuth from "./../auth/YoutubeAuth";
import YoutubeAuthCallback from "./../auth/YoutubeAuthCallback";
import TwitchAuth from "./../auth/TwitchAuth";
import TwitchAuthCallback from "./../auth/TwitchAuthCallback";
import Utilities from "./../../utilities/Utilities";
import NotifiesCreateAccount from "./../account/NotifiesCreateAccount";
import NotifiesLogin from "./../account/NotifiesLogin";
import NotifiesAccount from "./../account/NotifiesAccount";
import placeholder from "./../../assets/images/placeholder.png";
import styles from "./Navigation.module.scss";
import NoMatch from "./NoMatch.js";
import YoutubeNewVideo from "./../youtube/YoutubeNewVideo";

import TwitterAuth from "./../twitter/TwitterAuth";
import streamOnlineWebhook from "./../twitch/Twitchwebhooks";

function Navigation() {
  return (
    <Router>
      <HandleRefresh>
        {data => (
          <>
            <NavigationBar data={data} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/index' component={Home} />
              <Route exact path='/home' component={Home} />
              <Route
                exact
                path='/feed'
                render={() => {
                  return <Feed />;
                }}
                // render={() =>
                //   Utilities.getCookie("Notifies_AccountName") ? (
                //     <Feed />
                //   ) : (
                //     <>
                //       <ErrorHandeling
                //         data={{
                //           title: "Please login",
                //           message: "You are not logged with your Notifies account.",
                //         }}></ErrorHandeling>
                //       <Button className={styles.notifiesLogin} as={NavLink} to='/account/login'>
                //         Login
                //       </Button>
                //     </>
                //   )
                // }
              />
              <Route exact path='/twitch/notifications' component={streamOnlineWebhook} />
              <Route exact path='/youtube/notifications' component={YoutubeNewVideo} />
              <Route exact path='/auth/youtube' component={YoutubeAuth} />
              <Route exact path='/auth/twitch' component={TwitchAuth} />
              <Route exact path='/auth/twitch/callback' component={TwitchAuthCallback} />
              <Route exact path='/auth/youtube/callback' component={YoutubeAuthCallback} />
              <Route exact path='/auth/twitter' component={TwitterAuth} />
              <Route exact path='/auth/twitter/callback' component={TwitterAuth} />
              <Route exact path='/account' render={() => <NotifiesAccount data={data} />} />
              <Route
                exact
                path='/account/create'
                render={() => <NotifiesCreateAccount data={data} />}
              />
              <Route exact path='/account/login' render={() => <NotifiesLogin data={data} />} />

              <Route component={NoMatch} />
            </Switch>
          </>
        )}
      </HandleRefresh>
    </Router>
  );
}

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
        <img src={`${process.env.PUBLIC_URL}/icons/v2/Logo-4k.png`} alt='logo' className='logo' />
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
export default Navigation;
