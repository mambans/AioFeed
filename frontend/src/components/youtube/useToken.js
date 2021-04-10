import React, { useCallback, useContext, useRef } from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import validateToken from './validateToken';

const TTL = 30000;

export const YoutubeContext = React.createContext();

export const YoutubeProvider = ({ children }) => {
  const [pref, setPref] = useLocalStorageState('YoutubePreferences', {}) || {};
  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  return (
    <YoutubeContext.Provider
      value={{
        validationOfToken,
        youtubeVideoHoverEnable: Boolean(pref.video_hover),
        setYoutubeVideoHoverEnable: () => toggle('video_hover'),
      }}
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
