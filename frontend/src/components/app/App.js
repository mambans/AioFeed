import React, { useEffect, useContext } from "react";

import Routes from "./../routes";
import SetStartupTheme from "../themes";
import ThemeContext from "./../themes/ThemeContext";
import CookieConsentAlert from "../CookieConsentAlert";

export default () => {
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
