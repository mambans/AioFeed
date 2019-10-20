import React, { useEffect } from "react";
import Routes from "./../routes/Routes";
import SetStartupTheme from "../themes/SetStartupTheme";

function App() {
  useEffect(() => {
    SetStartupTheme();

    console.log("Mounting App");
  }, []);

  return <Routes />;
}

export default App;
