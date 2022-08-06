import React, { useContext, useEffect, useRef, useState } from 'react';
import Amplify, { Auth, Hub, Logger } from 'aws-amplify';
import { toast } from 'react-toastify';
import LogsContext from '../logs/LogsContext';

Amplify.configure({
  Auth: {
    region: 'eu-north-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  },
});

const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { addLog } = useContext(LogsContext);
  const invoked = useRef();

  const authenticate = async ({ username, password }) => {
    try {
      setLoading(true);
      const user = await Auth.signIn(username, password);

      // TO COMPLETE NEW PASSWORD (AFTER FORGOT PASSWORD)
      // if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      //   const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
      //   Auth.completeNewPassword(
      //     user, // the Cognito User Object
      //     newPassword, // the new password
      //     // OPTIONAL, the required attributes
      //     {
      //       email: 'xxxx@example.com',
      //       phone_number: '1234567890',
      //     }
      //   )
      //     .then((user) => {
      //       // at this time the user is logged in if no MFA required
      //       console.log(user);
      //     })
      //     .catch((e) => {
      //       console.log(e);
      //     });
      // } else {
      //   // other situations
      // }
      setUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      console.log('error signing in', error);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  // async function resendConfirmationCode() {
  //   try {
  //     await Auth.resendSignUp(username);
  //     console.log('code resent successfully');
  //   } catch (err) {
  //     console.log('error resending code: ', err);
  //   }
  // }

  async function deleteUser() {
    try {
      const result = await Auth.deleteUser();
      console.log(result);
      if (result === 'SUCCESS') setUser(null);
    } catch (error) {
      console.log('Error deleting user', error);
    }
  }

  //CHANGE PASSWORD
  // Auth.currentAuthenticatedUser()
  //   .then((user) => {
  //     return Auth.changePassword(user, 'oldPassword', 'newPassword');
  //   })
  //   .then((data) => console.log(data))
  //   .catch((err) => console.log(err));

  //FORGOT PASSWORD
  // // Send confirmation code to user's email
  // Auth.forgotPassword(username)
  //   .then((data) => console.log(data))
  //   .catch((err) => console.log(err));

  // // Collect confirmation code and new password, then
  // Auth.forgotPasswordSubmit(username, code, new_password)
  //   .then((data) => console.log(data))
  //   .catch((err) => console.log(err));

  const signOut = async () => {
    try {
      //signout from all devices
      // const signedOut = await Auth.signOut({ global: true });
      const signedOut = await Auth.signOut();
      console.log('signedOut:', signedOut);
      setUser(null);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  useEffect(() => {
    //Fix this runs twice for some reason
    (async () => {
      if (invoked.current) return null;
      invoked.current = true;

      setLoading(true);
      try {
        const user = await Auth.currentAuthenticatedUser();
        // const session = await Auth.currentSession();
        // console.log('user:', user);
        // console.log('session:', session);
        setUser(user);
      } catch (error) {}

      setLoading(false);

      const logger = new Logger('My-Logger');

      const listener = (data) => {
        switch (data?.payload?.event) {
          case 'signIn':
            logger.info('logger: user signed in');
            console.log('logger: user signed in');
            setUser(data?.payload?.data);
            toast.success(`Logged in as ${data?.payload?.data?.username}`);
            addLog({
              title: `Sign in`,
              text: `Signed in as ${data?.payload?.data?.username}`,
              icon: 'login',
            });
            break;
          case 'signUp':
            logger.info('logger: user signed up');
            console.log('logger: user signed up');
            break;
          case 'signOut':
            logger.info('logger: user signed out');
            console.log('logger: user signed out');
            setUser(null);
            toast.success(`Signed out`);
            addLog({
              title: `Signed out`,
              icon: 'login',
            });
            break;
          case 'signIn_failure':
            logger.error('logger: user sign in failed');
            console.log('logger: user sign in failed');
            toast.warning(data?.payload?.data?.message);
            break;
          case 'tokenRefresh':
            logger.info('logger: token refresh succeeded');
            console.log('logger: token refresh succeeded');
            break;
          case 'tokenRefresh_failure':
            logger.error('logger: token refresh failed');
            console.log('logger: token refresh failed');
            break;
          case 'configured':
            logger.info('logger: the Auth module is configured');
            console.log('logger: the Auth module is configured');
            break;
          default:
            return;
        }
      };

      Hub.listen('auth', listener);
    })();
  }, [addLog]);

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        signOut,
        user,
        setUser,
        loading,
        setLoading,
        deleteUser,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
export default AccountContext;
