import React, { useEffect, useContext } from "react";

import Routes from "./../routes";
import SetStartupTheme from "../themes";
import ThemeContext from "./../themes/ThemeContext";
import CookieConsentAlert from "../CookieConsentAlert";
import { ThemeProvider } from "../themes/ThemeContext";

export default () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

const App = () => {
  const { themesArray } = useContext(ThemeContext);

  useEffect(() => {
    SetStartupTheme(themesArray);
  }, [themesArray]);

  return (
    <>
      <Routes />
      <CookieConsentAlert />
    </>
  );
};
