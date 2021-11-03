import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import API from '../navigation/API';
import AccountContext from '../account/AccountContext';

const MyListsContext = React.createContext();

export const MyListsProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const [lists, setLists] = useSyncedLocalState('Mylists', {}) || {};
  const [myListPreferences, setMyListPreferences] =
    useSyncedLocalState('MylistsPreferences', {}) || {};
  const [isLoading, setIsLoading] = useState();
  const invoked = useRef(false);

  const orderedList = useMemo(() => {
    return Object.values(lists).reduce((lists, list) => {
      return {
        ...lists,
        [list.name]: {
          ...list,
          items: myListPreferences?.[list.name]?.Reversed
            ? [...list?.items]?.reverse()
            : list.items,
        },
      };
    }, {});
  }, [lists, myListPreferences]);

  const fetchMyListContextData = useCallback(async () => {
    setIsLoading(true);
    const Lists = await API.getSavedList();

    if (Lists) setLists(Lists);
  }, [setLists]);

  useEffect(() => {
    if (authKey && !invoked.current) fetchMyListContextData();
  }, [fetchMyListContextData, authKey]);

  return (
    <MyListsContext.Provider
      value={{
        lists: orderedList,
        setLists,
        fetchMyListContextData,
        isLoading,
        setIsLoading,
        myListPreferences,
        setMyListPreferences,
      }}
    >
      {children}
    </MyListsContext.Provider>
  );
};

export default MyListsContext;
