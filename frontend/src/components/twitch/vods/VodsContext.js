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
  const location = window.location.pathname?.split('/')[1];
  const invoked = useRef(false);

  const fetchVodsContextData = useCallback(async () => {
    console.log('fetchVodsContextData:');
    const vodContextBlacklistRoutes = [
      '',
      'index',
      'home',
      'legality',
      'privacy',
      'twitter',
      'auth',
    ];

    if (
      getCookie(`Twitch-access_token`) &&
      (!vodContextBlacklistRoutes.includes(location) || forceMount) &&
      (isEnabledUpdateNotifications || isEnabledOfflineNotifications || enableTwitchVods)
    ) {
      const { vod_channels } = await API.getTwitchData()
        .then((res) => res?.data?.Item)
        .catch((e) => {
          console.error('Twitch usetoken useEffect error: ', e);
          toast.error(e.message);
        });

      setChannels((vod_channels || getLocalstorage('TwitchVods-Channels') || []).filter((i) => i));
      invoked.current = true;
    }
  }, [
    setChannels,
    isEnabledUpdateNotifications,
    isEnabledOfflineNotifications,
    enableTwitchVods,
    forceMount,
    location,
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
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
