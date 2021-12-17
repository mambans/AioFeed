import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useCookieState from '../../hooks/useCookieState';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import AccountContext from '../account/AccountContext';
import API from '../navigation/API';
import validateToken from './validateToken';

const TTL = 30000;

export const YoutubeContext = React.createContext();

export const YoutubeProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const [pref, setPref] = useLocalStorageState('YoutubePreferences', {}) || {};
  const [youtubeAccessToken, setYoutubeAccessToken] = useCookieState('Youtube-access_token');
  const [youtubeUsername, setYoutubeUsername] = useCookieState('YoutubeUsername');
  const [youtubeProfileImage, setYoutubeProfileImage] = useCookieState('YoutubeProfileImg');
  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

  const invoked = useRef(false);
  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  const fetchYoutubeContextData = useCallback(async () => {
    const { access_token, user: { Profile, Username } = {} } = await API.getYoutubeData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Twitch usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setYoutubeUsername(Username);
    setYoutubeProfileImage(Profile);
    setYoutubeAccessToken(access_token);
    invoked.current = true;
  }, [setYoutubeUsername, setYoutubeProfileImage, setYoutubeAccessToken]);

  useEffect(() => {
    if (youtubeAccessToken && authKey && !invoked.current) fetchYoutubeContextData();
  }, [fetchYoutubeContextData, youtubeAccessToken, authKey]);

  return (
    <YoutubeContext.Provider
      value={{
        validationOfToken,
        youtubeVideoHoverEnable: Boolean(pref.video_hover),
        setYoutubeVideoHoverEnable: () => toggle('video_hover'),
        youtubeAccessToken,
        setYoutubeAccessToken,
        youtubeUsername,
        setYoutubeUsername,
        youtubeProfileImage,
        setYoutubeProfileImage,
        fetchYoutubeContextData,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(YoutubeContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};

export default useToken;
