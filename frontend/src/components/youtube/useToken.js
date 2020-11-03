import React, { useCallback, useContext, useRef, useState } from 'react';
import { getCookie } from '../../util/Utils';
import validateToken from './validateToken';

const TTL = 30000;

export const YoutubeContext = React.createContext();

export const YoutubeProvider = ({ children }) => {
  const [youtubeVideoHoverEnable, setYoutubeVideoHoverEnable] = useState(
    getCookie('YoutubeVideoHoverEnabled')
  );
  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  return (
    <YoutubeContext.Provider
      value={{ validationOfToken, youtubeVideoHoverEnable, setYoutubeVideoHoverEnable }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};

export default () => {
  const { validationOfToken } = useContext(YoutubeContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
