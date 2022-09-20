import React, { useEffect, useContext, useCallback, useRef } from 'react';
import { getCookie } from '../../../util';
import API from '../../navigation/API';
import { toast } from 'react-toastify';
import AccountContext from '../../account/AccountContext';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { vodChannelsAtom } from './atoms';
import { feedPreferencesAtom } from '../../../atoms/atoms';

const VodsContext = React.createContext();

export const VodsProvider = ({ children }) => {
  const { user } = useContext(AccountContext) || {};
  const { vods } = useRecoilValue(feedPreferencesAtom) || {};

  const setChannels = useSetRecoilState(vodChannelsAtom);
  const invoked = useRef(false);

  const fetchVodsContextData = useCallback(async () => {
    if (getCookie(`Twitch-access_token`) && vods?.enabled) {
      const channels = await API.getVodChannels().catch((e) => {
        console.error('Twitch usetoken useEffect error: ', e);
        toast.error(e.message);
      });

      setChannels(channels, invoked.current);
      invoked.current = true;
    }
  }, [setChannels, vods?.enabled]);

  useEffect(() => {
    if (user && !invoked.current) fetchVodsContextData();
  }, [fetchVodsContextData, user]);

  return (
    <VodsContext.Provider
      value={{
        fetchVodsContextData,
      }}
    >
      {children}
    </VodsContext.Provider>
  );
};

export default VodsContext;
