import React, { useContext, useState } from 'react';
import AccountContext from '../account/AccountContext';

const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  const [sidebarComonentKey, setSidebarComonentKey] = useState(
    user ? { comp: 'account' } : { comp: 'signin' }
  );

  return (
    <NavigationContext.Provider
      value={{
        sidebarComonentKey,
        setSidebarComonentKey,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
