import React from 'react';

import useCookieState from './../../hooks/useCookieState';

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [username, setUsername] = useCookieState(`AioFeed_AccountName`);
  const [profileImage, setProfileImage] = useCookieState(`AioFeed_AccountProfileImg`);
  const [authKey, setAuthKey] = useCookieState(`AioFeed_AuthKey`);
  const [email, setEmail] = useCookieState('AioFeed_AccountEmail');

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
