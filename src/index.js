import React from "react";
import ReactDOM from "react-dom";
// import "bootstrap/dist/css/bootstrap.css";
import "./variables.scss";
import "normalize.css";
import "./index.scss";

// import App from "./components/app/App";
import * as serviceWorker from "./serviceWorker";

import Navigation from "./components/navigation/navigation";

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(<div id="main-body" />, document.getElementById("root"));

function mainBody() {
    return (
        <div id="main-body">
            <Navigation />
        </div>
    );
}

ReactDOM.render(mainBody(), document.getElementById("root"));
