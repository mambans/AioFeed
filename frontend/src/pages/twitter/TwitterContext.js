import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import AccountContext from '../account/AccountContext';
import API from '../navigation/API';

const TwitterContext = React.createContext();

export const TwitterProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const [twitterLists, setTwitterLists] = useLocalStorageState('Twitter-Lists');
  const invoked = useRef(false);

  const fetchTwitterContextData = useCallback(async () => {
    const { lists } = await API.getTwitterLists()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Twitter context useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setTwitterLists(lists);
  }, [setTwitterLists]);

  useEffect(() => {
    if (authKey && !invoked.current) fetchTwitterContextData();
  }, [fetchTwitterContextData, authKey]);

  return (
    <TwitterContext.Provider value={{ twitterLists, setTwitterLists, fetchTwitterContextData }}>
      {children}
    </TwitterContext.Provider>
  );
};

export default TwitterContext;
