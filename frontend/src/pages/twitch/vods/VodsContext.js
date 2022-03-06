import React, { useEffect, useContext, useCallback, useRef } from 'react';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { getCookie, getLocalstorage } from '../../../util';
import FeedsContext from '../../feed/FeedsContext';
import { TwitchContext } from '../useToken';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import API from '../../navigation/API';
import { toast } from 'react-toastify';
import AccountContext from '../../account/AccountContext';

const VodsContext = React.createContext();

export const VodsProvider = ({ children, forceMount = false }) => {
  const { isEnabledUpdateNotifications, isEnabledOfflineNotifications, twitchAccessToken } =
    useContext(TwitchContext);
  const { authKey } = useContext(AccountContext) || {};
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const [vods, setVods] = useLocalStorageState('Vods', {});
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
  const invoked = useRef(false);

  const fetchVodsContextData = useCallback(async () => {
    if (
      getCookie(`Twitch-access_token`) &&
      (isEnabledUpdateNotifications ||
        isEnabledOfflineNotifications ||
        enableTwitchVods ||
        forceMount)
    ) {
      const res = await API.getTwitchData()
        .then((res) => res?.data?.Item)
        .catch((e) => {
          console.error('Twitch usetoken useEffect error: ', e);
          toast.error(e.message);
        });

      setChannels(
        (res?.vod_channels || getLocalstorage('TwitchVods-Channels') || []).filter((i) => i)
      );
      invoked.current = true;
    }
  }, [
    setChannels,
    isEnabledUpdateNotifications,
    isEnabledOfflineNotifications,
    enableTwitchVods,
    forceMount,
  ]);

  useEffect(() => {
    if (twitchAccessToken && authKey && !invoked.current) fetchVodsContextData();
  }, [fetchVodsContextData, twitchAccessToken, authKey]);

  return (
    <VodsContext.Provider
      value={{
        vods,
        setVods,
        channels,
        setChannels,
        fetchVodsContextData,
        enableTwitchVods,
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
