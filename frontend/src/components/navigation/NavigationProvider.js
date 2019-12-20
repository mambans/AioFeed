import React, { useState } from "react";

import Utilities from "./../../utilities/Utilities";
import NavigationContext from "./NavigationContext";

const NavigationProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Utilities.getCookie("Notifies_AccountName"));
  const [renderModal, setRenderModal] = useState("login");
  const [visible, setVisible] = useState(true);

  return (
    <NavigationContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        renderModal,
        setRenderModal,
        visible,
        setVisible,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
