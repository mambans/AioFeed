import React, { useEffect } from "react";
import Routes from "./../routes/Routes";

function App() {
  useEffect(() => {
    const currentMonth = new Date().getMonth();

    if (currentMonth === 11) {
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", "christmas");
      localStorage.setItem("activeTheme", "christmas");
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
