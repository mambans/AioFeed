import React, { useEffect } from 'react';

import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import API from '../../navigation/API';

const CustomFilterContext = React.createContext();

export const CustomFilterProvider = ({ children }) => {
  const [filters, setFilters] = useSyncedLocalState('CustomFilters', {});

  useEffect(() => {
    (async () => {
      const fetchedFilters = await API.getCustomfilters();

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
