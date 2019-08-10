import React from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { BrowserRouter as Router, NavLink, Route } from "react-router-dom";
// import ReactDOM from "react-dom";
// import GoogleLogin from "react-google-login";

// Own modules
import "./navigation.scss";
import logo from "../../assets/images/logo-white.png";
import Subscriptions from "./../subscriptions/Subscriptions";
import Posts from "./../posts/Posts";

function Navigation() {
    return (
        <Router>
            <NavigationBar />

            <Route exact path="/" component={Home} />
            <Route path="/subscriptions" component={Subscriptions} />
            <Route path="/posts" component={Posts} />
        </Router>
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
                    <Nav.Link as={NavLink} to="/subscriptions" activeClassName="active">
                        Subscriptions
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
                    <Nav.Link href="#login" id="login">
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

// const responseGoogle = response => {
//     console.log(response);
// };

// ReactDOM.render(
//     <GoogleLogin
//         clientId="

// 359792337122-v0dqlfulrmj1qtuibdcmj9k3ld8c9rcf.apps.googleusercontent.com

// "
//         buttonText="Login"
//         onSuccess={responseGoogle}
//         onFailure={responseGoogle}
//         cookiePolicy={"single_host_origin"}
//     />,
//     document.getElementById("login")
// );

export default Navigation;
