import React, { useState } from "react";

import Utilities from "./../../utilities/Utilities";
import NavigationContext from "./NavigationContext";

const NavigationProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Utilities.getCookie("Notifies_AccountName"));
  const [renderModal, setRenderModal] = useState("login");

  return (
    <NavigationContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        renderModal: renderModal,
        setRenderModal: setRenderModal,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
