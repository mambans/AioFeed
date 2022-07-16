import React, { useState, useContext } from 'react';
import AccountContext from '../account/AccountContext';

const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarComonentKey, setSidebarComonentKey] = useState(
    user ? { comp: 'account' } : { comp: 'signin' }
  );
  const [visible, setVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [shrinkNavbar, setShrinkNavbar] = useState('false');
  const [alert, setAlert] = useState();
  const [overflow, setOverflow] = useState();

  return (
    <NavigationContext.Provider
      value={{
        setShowSidebar,
        showSidebar,
        sidebarComonentKey,
        setSidebarComonentKey,
        visible,
        setVisible,
        footerVisible,
        setFooterVisible,
        shrinkNavbar,
        setShrinkNavbar,
        setAlert,
        alert,
        overflow,
        setOverflow,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
