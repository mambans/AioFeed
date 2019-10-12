import React from "react";
import ReactDOM from "react-dom";
import "./variables.scss";
import "normalize.css";
import "./index.scss";
import Routes from "../src/components/routes/Routes";

import * as serviceWorker from "./serviceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(
  <div id='main-body'>
    <Routes />
  </div>,
  document.getElementById("root")
);
