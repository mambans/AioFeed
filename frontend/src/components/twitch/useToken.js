import React, { useCallback, useContext, useRef, useState } from 'react';
import { getCookie } from '../../util/Utils';
import validateToken from './validateToken';

const TTL = 100000;

export const TwitchContext = React.createContext();

export const TwitchProvider = ({ children }) => {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(
    getCookie(`Twitch_AutoRefresh`) || false
  );
  const [isEnabledOfflineNotifications, setIsEnabledOfflineNotifications] = useState(
    getCookie('Twitch_offline_notifications')
  );
  const [isEnabledUpdateNotifications, setIsEnabledUpdateNotifications] = useState(
    getCookie('Twitch_update_notifications')
  );
  const [twitchVideoHoverEnable, setTwitchVideoHoverEnable] = useState(
    getCookie('TwitchVideoHoverEnabled')
  );
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
        autoRefreshEnabled,
        setAutoRefreshEnabled,
        twitchVideoHoverEnable,
        setTwitchVideoHoverEnable,
        isEnabledOfflineNotifications,
        setIsEnabledOfflineNotifications,
        isEnabledUpdateNotifications,
        setIsEnabledUpdateNotifications,
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

export default () => {
  const { validationOfToken } = useContext(TwitchContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
