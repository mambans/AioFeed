import React, { useEffect, useContext } from 'react';
import FetchMonitoredVodChannelsList from './FetchMonitoredVodChannelsList';
import AccountContext from '../../account/AccountContext';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { getLocalstorage } from '../../../util/Utils';
import FeedsContext from '../../feed/FeedsContext';

const VodsContext = React.createContext();

export const VodsProvider = ({ children }) => {
  const { username, authKey } = useContext(AccountContext);
  const {
    isEnabledUpdateNotifications,
    isEnabledOfflineNotifications,
    enableTwitchVods,
  } = useContext(FeedsContext);
  const [vods, setVods] = useSyncedLocalState('Vods', []);
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );

  useEffect(() => {
    (async () => {
      if (isEnabledUpdateNotifications || isEnabledOfflineNotifications || enableTwitchVods) {
        const fetchedColumns = await FetchMonitoredVodChannelsList(username, authKey);
        // console.log('VodsProvider -> fetchedColumns', fetchedColumns);

        setChannels(
          fetchedColumns.TwitchVodsPreferences?.Channels ||
            getLocalstorage('TwitchVods-Channels') ||
            []
        );
        setUpdateNotischannels(
          fetchedColumns.TwitchPreferences?.ChannelsUpdateNotifs ||
            getLocalstorage('ChannelsUpdateNotifs') ||
            []
        );
      }
    })();
  }, [
    username,
    authKey,
    setChannels,
    setUpdateNotischannels,
    isEnabledUpdateNotifications,
    isEnabledOfflineNotifications,
    enableTwitchVods,
  ]);

  return (
    <VodsContext.Provider
      value={{
        vods,
        setVods,
        channels,
        setChannels,
        updateNotischannels,
        setUpdateNotischannels,
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
