import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getCookie } from '../../util';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import API from '../navigation/API';

const MyListsContext = React.createContext();

export const MyListsProvider = ({ children }) => {
  const [lists, setLists] = useSyncedLocalState('Mylists', {}) || {};
  const [myListPreferences, setMyListPreferences] =
    useSyncedLocalState('MylistsPreferences', {}) || {};
  const [isLoading, setIsLoading] = useState();

  const orderedList = useMemo(() => {
    return Object.values(lists).reduce((lists, list) => {
      return {
        ...lists,
        [list[list.name]]: {
          ...list,
          items: myListPreferences?.[list.name]?.Reversed
            ? [...list?.items]?.reverse()
            : list.items,
        },
      };
    }, {});
  }, [lists, myListPreferences]);

  const fetchAllLists = useCallback(async () => {
    setIsLoading(true);
    const Lists = await API.getSavedList();

    if (Lists) setLists(Lists);
  }, [setLists]);

  useEffect(() => {
    if (getCookie(`AioFeed_AccountName`)) fetchAllLists();
  }, [fetchAllLists]);

  return (
    <MyListsContext.Provider
      value={{
        lists: orderedList,
        setLists,
        fetchAllLists,
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
