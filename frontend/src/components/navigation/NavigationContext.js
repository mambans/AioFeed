import React, { useState } from 'react';

const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [renderModal, setRenderModal] = useState('login');
  const [visible, setVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [shrinkNavbar, setShrinkNavbar] = useState('false');
  const [alert, setAlert] = useState();

  return (
    <NavigationContext.Provider
      value={{
        setShowSidebar,
        showSidebar,
        renderModal,
        setRenderModal,
        visible,
        setVisible,
        footerVisible,
        setFooterVisible,
        shrinkNavbar,
        setShrinkNavbar,
        setAlert,
        alert,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
