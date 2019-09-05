import React from "react";
import Nav from "react-bootstrap/Nav";

class HelloMessage extends React.Component {
    render() {
        return (
            <>
                <h1>Routes: </h1>
                <Nav defaultActiveKey="/home" className="flex-column">
                    {console.log("All paths/routes: \n")}
                    {this.props.app._router.stack.map(function(r) {
                        if (r.route && r.route.path) {
                            console.log("   ", r.route.path);
                            return (
                                <Nav.Link href={r.route.path} key={r.route.path}>
                                    {r.route.path}
                                </Nav.Link>
                            );
                        }
                        return "";
                    })}
                    {console.log("-------------------------------------")}
                    <Nav.Link eventKey="disabled" disabled>
                        Disabled
                    </Nav.Link>
                </Nav>
            </>
        );
    }
}

module.exports = HelloMessage;
