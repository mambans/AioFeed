import AuthContextProvider, { AuthContext } from "components/login/AuthContextProvider";
import React from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { BrowserRouter as Router, NavLink, Route, Redirect } from "react-router-dom";

import "./navigation.scss";
import logo from "../../assets/images/logo-v2.png";
import Home from "./../home/Home";
import Feed from "./../feed/Feed";
import twitchAuth from "../login/TwitchLogin";
import youtubeAuth from "./../login/YoutubeLogin";
import Posts from "./../posts/Posts";

import AuthContextProvider, { AuthContext } from "components/login/AuthContextProvider";

function Navigation() {
  return (
    <AuthContextProvider>
      <AuthContext.Consumer>
        {({ loggedIn }) => (
          <Router>
            <NavigationBar />

            <Route exact path="/" component={Home} />
            <Route path="/feed" render={() => (loggedIn ? <Feed /> : <Redirect to="/login" />)} />
            <Route path="/posts" component={Posts} />
            <Route
              path="/youtube/login"
              component={() => {
                window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_YOUTUBE_CLIENT_ID}&redirect_uri=http://localhost:3000/youtube/auth&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly&include_granted_scopes=true`;
                return null;
              }}
            />
            <Route
              path="/login"
              component={() => {
                window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/twitch/auth&scope=channel:read:subscriptions user:read:broadcast&response_type=code`;
                return null;
              }}
            />
            <Route path="/twitch/auth" component={twitchAuth} />
            <Route path="/youtube/auth" component={youtubeAuth} />
          </Router>
        )}
      </AuthContext.Consumer>
    </AuthContextProvider>
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
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
        <Nav>
          <Nav.Link as={NavLink} to="/login" id="login">
            Login Twitch{" "}
          </Nav.Link>
          <Nav.Link as={NavLink} to="/youtube/login" id="login">
            Login Youtube
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Navigation;
