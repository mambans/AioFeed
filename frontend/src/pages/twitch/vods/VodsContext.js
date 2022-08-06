import React, { useEffect, useContext, useCallback, useRef } from 'react';
import { getCookie } from '../../../util';
import FeedsContext from '../../feed/FeedsContext';
import API from '../../navigation/API';
import { toast } from 'react-toastify';
import AccountContext from '../../account/AccountContext';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';

const VodsContext = React.createContext();

export const VodsProvider = ({ children }) => {
  const { user } = useContext(AccountContext) || {};
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const [vods, setVods] = useSyncedLocalState('TwitchVods', { data: [] });
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
  const invoked = useRef(false);

  const fetchVodsContextData = useCallback(async () => {
    if (getCookie(`Twitch-access_token`) && enableTwitchVods) {
      const channels = await API.getVodChannel()
        .then((res) => res?.data?.channels)
        .catch((e) => {
          console.error('Twitch usetoken useEffect error: ', e);
          toast.error(e.message);
        });

      console.log('getVodChannel channels:', channels);
      setChannels(channels, invoked.current);
      invoked.current = true;
    }
  }, [setChannels, enableTwitchVods]);

  useEffect(() => {
    if (user && !invoked.current) fetchVodsContextData();
  }, [fetchVodsContextData, user]);

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
