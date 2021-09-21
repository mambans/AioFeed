import React, { useCallback, useEffect, useState } from 'react';
import { getCookie } from '../../util';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import API from '../navigation/API';

const MyListsContext = React.createContext();

export const MyListsProvider = ({ children }) => {
  const [lists, setLists] = useSyncedLocalState('Mylists', {}) || {};
  const [isLoading, setIsLoading] = useState();

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
        lists,
        setLists,
        fetchAllLists,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </MyListsContext.Provider>
  );
};

export default MyListsContext;
