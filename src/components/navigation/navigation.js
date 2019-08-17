import React from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { BrowserRouter as Router, NavLink, Route, Redirect } from "react-router-dom";
// import ReactDOM from "react-dom";
// import GoogleLogin from "react-google-login";

// Own modules
import "./navigation.scss";
import logo from "../../assets/images/logo-white.png";
import Feed from "./../Feed/Feed";
import Auth from "./../Login/Login";
import Posts from "./../posts/Posts";

import AuthContextProvider, { AuthContext } from "components/Login/AuthContextProvider";

function Navigation() {
    return (
        <AuthContextProvider>
            <AuthContext.Consumer>
                {({ loggedIn }) => (
                    <Router>
                        <NavigationBar />

                        <Route exact path="/" component={Home} />
                        <Route
                            path="/feed"
                            render={() => (loggedIn ? <Feed /> : <Redirect to="/login" />)}
                        />
                        <Route path="/posts" component={Posts} />
                        <Route
                            path="/login"
                            component={() => {
                                window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${
                                    process.env.REACT_APP_TWITCH_CLIENT_ID
                                }&redirect_uri=http://localhost:3000/twitch/auth&scope=channel:read:subscriptions&response_type=code`;
                                return null;
                            }}
                        />
                        <Route path="/twitch/auth" component={Auth} />
                    </Router>
                )}
            </AuthContext.Consumer>
        </AuthContextProvider>
    );
}

function Home() {
    return <h2>Home</h2>;
}

const NavigationBar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Nav.Link as={NavLink} to="/" className="logo-link">
                <img src={logo} alt="logo" className="logo" />
            </Nav.Link>
            <Navbar.Brand as={NavLink} to="/" activeClassName="active">
                Home
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to="/feed" activeClassName="active">
                        Feed
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/posts" activeClassName="active">
                        Posts
                    </Nav.Link>
                    <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    {/* <Nav.Link href="#login" id="login"> */}
                    <Nav.Link
                        as={NavLink}
                        // href=`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/twitch/auth&scope=channel:read:subscriptions&response_type=code`
                        to="/login"
                        id="login">
                        Login{" "}
                    </Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default Navigation;
