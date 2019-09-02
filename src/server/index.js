import React from "react";

class ServerHome extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Server- Home";
    }

    render() {
        return <h1>{this.title}</h1>;
    }
}

export default ServerHome;
