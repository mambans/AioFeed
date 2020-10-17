import React, { useCallback, useContext, useRef } from 'react';
import validateToken from './validateToken';

const TTL = 100000;

const TwitchContext = React.createContext();

export const TwitchProvider = ({ children }) => {
  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  return <TwitchContext.Provider value={validationOfToken}>{children}</TwitchContext.Provider>;
};

export default () => {
  const validationOfToken = useContext(TwitchContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
