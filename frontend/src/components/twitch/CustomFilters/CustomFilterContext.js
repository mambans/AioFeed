import React, { useEffect } from 'react';
import axios from 'axios';

import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { getCookie } from '../../../util/Utils';

const CustomFilterContext = React.createContext();

export const CustomFilterProvider = ({ children }) => {
  const [filters, setFilters] = useSyncedLocalState('CustomFilters', {});

  useEffect(() => {
    (async () => {
      const fetchedFilters = await axios
        .get(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/customfilters`, {
          params: {
            username: getCookie(`AioFeed_AccountName`),
            authkey: getCookie(`AioFeed_AuthKey`),
          },
        })
        .then((res) => res.data.Item.filters)
        .catch((e) => console.error(e));

      setFilters(fetchedFilters);
    })();
  }, [setFilters]);

  return (
    <CustomFilterContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </CustomFilterContext.Provider>
  );
};

export default CustomFilterContext;
