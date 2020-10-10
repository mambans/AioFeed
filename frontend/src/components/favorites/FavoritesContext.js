import React, { useCallback, useEffect, useState } from 'react';
import { getCookie } from '../../util/Utils';
import axios from 'axios';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';

const FavoritesContext = React.createContext();

export const FavoritesProvider = ({ children }) => {
  const [lists, setLists] = useSyncedLocalState('FavoritesLists', {});
  const [isLoading, setIsLoading] = useState();

  const fetchAllLists = useCallback(async () => {
    setIsLoading(true);
    const Lists = await axios
      .get(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        params: {
          username: getCookie(`AioFeed_AccountName`),
        },
      })
      .then((res) => {
        delete res.data.Item?.Username;
        return res.data.Item;
      })
      .catch((e) => console.error(e));

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
