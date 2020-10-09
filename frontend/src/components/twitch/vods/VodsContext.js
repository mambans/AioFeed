import React, { useState, useEffect, useContext } from 'react';
import FetchMonitoredVodChannelsList from './FetchMonitoredVodChannelsList';
import AccountContext from '../../account/AccountContext';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';

const VodsContext = React.createContext();

export const VodsProvider = ({ children }) => {
  const { username, authKey } = useContext(AccountContext);
  const [vods, setVods] = useState();
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);

  useEffect(() => {
    (async () => {
      const fetchedChannels = await FetchMonitoredVodChannelsList(username, authKey).then((res) => {
        return res.filter((channel) => channel);
      });
      console.log('useEffect-fetchedChannels', fetchedChannels);
      setChannels(fetchedChannels);
      // localStorage.setItem('TwitchVods-Channels', JSON.stringify(fetchedChannels));
    })();
  }, [username, authKey, setChannels]);

  return (
    <VodsContext.Provider
      value={{
        vods,
        setVods,
        channels,
        setChannels,
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
