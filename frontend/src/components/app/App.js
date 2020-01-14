import React, { useEffect, useContext } from "react";
import Routes from "./../routes/Routes";
import SetStartupTheme from "../themes/SetStartupTheme";
import ThemeContext from "./../themes/ThemeContext";

export default () => {
  const { themesArray } = useContext(ThemeContext);

  useEffect(() => {
    // console.log("Mounting App") ;
    SetStartupTheme(themesArray);
  }, []);

  return <Routes />;
};
