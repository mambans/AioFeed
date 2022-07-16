import React, { useEffect, useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../../Auth/UserPool';

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const getSession = async () => {
    return new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();

      if (user) {
        user.getSession((err, session) => {
          if (err) reject();
          resolve(session);
        });
      } else {
        reject();
      }
    });
  };

  const authenticate = async ({ username, password }) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: username,
        Pool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log('onSuccess data:', data);
          data.user = Pool.getCurrentUser();
          resolve(data);
          console.log('Pool.getCurrentUser():', Pool.getCurrentUser());
          setUser(Pool.getCurrentUser());
        },
        onFailure: (error) => {
          console.error('onFailure error:', error);
          reject(error);
        },
        newPasswordRequired: (data) => {
          console.log('newpasswordRequired data:', data);
        },
      });
    });
  };

  const signOut = () => {
    const user = Pool.getCurrentUser();
    if (user)
      return user.signOut(() => {
        setUser(null);
      });
  };

  const [session, setSession] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    //Fix this runs twice for some reason
    (async () => {
      console.log('useEffect:');
      const session = await getSession();
      console.log('session:', session);
      setSession(session);
      setUser(Pool.getCurrentUser());
    })();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('user:', user);
  //     console.log('session:', session);
  //   }, 1000);
  // }, [user, session]);

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        signOut,
        session,
        user,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
