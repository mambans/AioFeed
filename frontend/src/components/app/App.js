import React, { useEffect, useContext } from "react";
import Routes from "./../routes/Index";
import SetStartupTheme from "../themes/Index";
import ThemeContext from "./../themes/ThemeContext";

export default () => {
  const { themesArray } = useContext(ThemeContext);

  useEffect(() => {
    SetStartupTheme(themesArray);
  }, [themesArray]);

  return <Routes />;
};
