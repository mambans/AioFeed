import React, { useCallback, useEffect, useState } from 'react';
import { getCookie } from '../../util/Utils';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import API from '../navigation/API';

const FavoritesContext = React.createContext();

export const FavoritesProvider = ({ children }) => {
  const [lists, setLists] = useSyncedLocalState('FavoritesLists', {}) || {};
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
    <FavoritesContext.Provider
      value={{
        lists,
        setLists,
        fetchAllLists,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
