import React from "react";
import ReactDOM from "react-dom";
import "./variables.scss";
import "normalize.css";
import "./index.scss";
import App from "./components/app/App";
// import Routes from "../src/components/routes/Routes";
// import ThemeProvider from "react-theme-provider";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// ReactDOM.render(
//   // <div id='main-body'>
//   // <ThemeProvider theme={{ primaryColor: "red", background: "gray" }}>
//   <Routes />,
//   // {/* </ThemeProvider>, */}
//   // {/* </div>, */}
//   document.getElementById("root")
// );
