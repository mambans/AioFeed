import React, { useCallback, useContext, useRef } from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import validateToken from './validateToken';

const TTL = 100000;

export const TwitchContext = React.createContext();

export const TwitchProvider = ({ children }) => {
  const [pref, setPref] = useLocalStorageState('TwitchPreferences', {}) || {};
  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  return (
    <TwitchContext.Provider
      value={{
        validationOfToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        twitchVideoHoverEnable: Boolean(pref.video_hover),
        setTwitchVideoHoverEnable: () => toggle('video_hover'),
        isEnabledOfflineNotifications: Boolean(pref.offline_notis),
        setIsEnabledOfflineNotifications: () => toggle('offline_notis'),
        isEnabledUpdateNotifications: Boolean(pref.update_notis),
        setIsEnabledUpdateNotifications: () => toggle('update_notis'),
        setEnableVodVolumeOverlay: () => toggle('vod_volume_overlay'),
        enableVodVolumeOverlay: Boolean(pref.vod_volume_overlay),
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(TwitchContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
