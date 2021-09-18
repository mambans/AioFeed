import React, { useEffect, useContext } from 'react';

import FetchMonitoredVodChannelsList from './FetchMonitoredVodChannelsList';
import AccountContext from '../../account/AccountContext';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { getCookie, getLocalstorage } from '../../../util';
import FeedsContext from '../../feed/FeedsContext';
import { TwitchContext } from '../useToken';

const VodsContext = React.createContext();

export const VodsProvider = ({ children, forceMount = false }) => {
  const { username, authKey } = useContext(AccountContext);
  const { isEnabledUpdateNotifications, isEnabledOfflineNotifications } = useContext(TwitchContext);
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const [vods, setVods] = useSyncedLocalState('Vods', []);
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);

  const location = window.location.pathname?.split('/')[1];

  useEffect(() => {
    const vodContextBlacklistRoutes = [
      '',
      'index',
      'home',
      'legality',
      'privacy',
      'twitter',
      'auth',
    ];

    (async () => {
      if (
        getCookie(`Twitch-access_token`) &&
        (!vodContextBlacklistRoutes.includes(location) || forceMount) &&
        (isEnabledUpdateNotifications || isEnabledOfflineNotifications || enableTwitchVods)
      ) {
        const fetchedColumns = await FetchMonitoredVodChannelsList(username, authKey);

        setChannels(
          (
            fetchedColumns?.TwitchVodsPreferences?.Channels ||
            getLocalstorage('TwitchVods-Channels') ||
            []
          ).filter((i) => i)
        );
        setUpdateNotischannels(
          (
            fetchedColumns?.TwitchPreferences?.ChannelsUpdateNotifs ||
            getLocalstorage('ChannelsUpdateNotifs') ||
            []
          ).filter((i) => i)
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
    forceMount,
    location,
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
        favStreams,
        setFavStreams,
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
