import React, { useState } from 'react';

const FooterContext = React.createContext();

export const FooterProvider = ({ children }) => {
  const [footerVisibleInViewport, setFooterVisibleInViewport] = useState();

  return (
    <FooterContext.Provider
      value={{
        footerVisibleInViewport,
        setFooterVisibleInViewport,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
};

export default FooterContext;
