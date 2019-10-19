import React, { useEffect } from "react";
import Routes from "./../routes/Routes";

/*
 *TODO: Add dynamic theming.
 */

function App() {
  useEffect(() => {
    // default or light theme

    // const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    // if (currentMonth === 11) {
    if (currentDate === 20) {
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", "christmas");
      window.setTimeout(function() {
        document.documentElement.classList.remove("theme-transition");
      }, 1000);
    } else if (localStorage.getItem("activeTheme")) {
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", localStorage.getItem("activeTheme"));
      window.setTimeout(function() {
        document.documentElement.classList.remove("theme-transition");
      }, 1000);
    }

    console.log("Mounting App");
  }, []);

  return <Routes />;
}

export default App;
