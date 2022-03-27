import React, { useState } from 'react';

import useCookieState from '../../hooks/useCookieState';

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [username, setUsername] = useCookieState(`AioFeed_AccountName`);
  const [profileImage, setProfileImage] = useState();
  const [authKey, setAuthKey] = useCookieState(`AioFeed_AuthKey`);
  const [email, setEmail] = useState();

  return (
    <AccountContext.Provider
      value={{
        authKey,
        setAuthKey,
        username,
        setUsername,
        profileImage,
        setProfileImage,
        email,
        setEmail,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
