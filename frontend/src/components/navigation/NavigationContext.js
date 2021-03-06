import React, { useState, useContext } from 'react';
import AccountContext from '../account/AccountContext';

const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
  const { username } = useContext(AccountContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [renderModal, setRenderModal] = useState(username ? 'account' : 'login');
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
