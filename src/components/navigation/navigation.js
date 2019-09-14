// import AuthContextProvider, { AuthContext } from "components/auth/AuthContextProvider";
import React from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
// eslint-disable-next-line
import { BrowserRouter as Router, NavLink, Route, Redirect } from "react-router-dom";

import "./Navigation.scss";
import logo from "../../assets/images/logo-v2.png";
import Home from "./../home/Home";
import Feed from "./../feed/Feed";
import youtubeAuth from "./../auth/YoutubeAuth";
import TwitchAuth from "./../auth/TwitchAuth";
import ErrorHandeling from "./../error/Error";
import Utilities from "./../../utilities/Utilities";

// import Posts from "./../posts/Posts";
import streamOnlineWebhook from "./../twitch/Twitchwebhooks";

function Navigation() {
  return (
    // <AuthContextProvider>
    //   <AuthContext.Consumer>
    //     {({ loggedIn }) => (
    <Router>
      <NavigationBar />

      <Route exact path="/" component={Home} />
      <Route
        path="/feed"
        render={() =>
          Utilities.getCookie("Twitch-access_token") &&
          Utilities.getCookie("Youtube-access_token") ? (
            <Feed />
          ) : (
            <ErrorHandeling
              data={{
                title: "Please login",
                message: "You are not logged with Twitch or Youtube.",
              }}></ErrorHandeling>

            // <Redirect to="/login" />
          )
        }
      />
      <Route path="/twitch/notifications" component={streamOnlineWebhook} />
      {/* <Route path="/twitch/notifications/callback" component={} /> */}
      <Route
        path="/youtube/login"
        component={() => {
          youtubeAuth();
          return null;
        }}
      />
      <Route
        path="/login"
        component={() => {
          TwitchAuth();
          return null;
        }}
      />
      <Route path="/twitch/auth" component={TwitchAuth} />
      <Route path="/youtube/auth" component={youtubeAuth} />
    </Router>
    //     )}
    //   </AuthContext.Consumer>
    // </AuthContextProvider>
  );
}

const NavigationBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Nav.Link as={NavLink} to="/" className="logo-link">
        <img src={logo} alt="logo" className="logo" />
        Notifies
      </Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Container>
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/feed" activeClassName="active">
              Feed
            </Nav.Link>
            <Nav.Link as={NavLink} to="/twitch/notifications" activeClassName="active">
              Webhooks
            </Nav.Link>
          </Nav>
        </Container>
        <Nav>
          <NavDropdown title="Login" id="collasible-nav-dropdown">
            <NavDropdown.Item as={NavLink} to="/login" id="login">
              Login Twitch
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/youtube/login" id="login">
              Login Youtube
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Other" id="collasible-nav-dropdown">
            <NavDropdown.Item disabled as={NavLink} to="/asd" id="login">
              Asd
            </NavDropdown.Item>
            <NavDropdown.Item disabled as={NavLink} to="/asd" id="login">
              Asd
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="https://github.com/mambans/Notifies">
              Notifies -Github
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Navigation;
