import React from 'react';

import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const ThemeContext = React.createContext();

export const findSeasonOrDefaultTheme = (allThemes) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  const startTheme = allThemes.find(
    (themes) =>
      themes?.startMonth <= currentMonth &&
      themes?.endMonth >= currentMonth &&
      themes?.startDate <= currentDate &&
      themes?.endDate >= currentDate
  );

  const defaultTheme = allThemes.find((themes) => themes.default);

  return startTheme || defaultTheme || {};
};

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useSyncedLocalState('activeTheme', {
    name: 'default',
    type: 'dark',
  });

  const themesArray = [
    {
      name: 'default',
      type: 'dark',
      image: findSeasonOrDefaultTheme,
    },
    {
      name: 'matt blue',
      type: 'dark',
      image: 'webp/matt_blue.webp',
    },
    {
      name: 'clean',
      type: 'dark',
      image: 'webp/clean.webp',
    },
    {
      name: 'dark',
      type: 'dark',
      backgroundColor: '#101216',
    },
    {
      name: 'coffee',
      type: 'dark',
      image: 'webp/coffee.webp',
      default: true,
    },
    {
      name: 'wood',
      type: 'dark',
      image: 'webp/wood.webp',
    },
    {
      name: 'headphones',
      type: 'dark',
      image: 'webp/headphones3.webp',
    },
    {
      name: 'stone',
      type: 'dark',
      image: 'webp/stone.webp',
    },
    {
      name: 'light',
      type: 'light',
      backgroundColor: 'white',
    },

    {
      name: 'christmas',
      type: 'dark',
      image: 'webp/christmas.webp',
      startMonth: 12,
      startDate: 1,
      endMonth: 12,
      endDate: 31,
    },
    {
      name: "new year's eve",
      type: 'dark',
      image: 'webp/new_years_eve.webp',
      startMonth: 1,
      startDate: 1,
      endMonth: 1,
      endDate: 1,
    },
  ];

  return (
    <ThemeContext.Provider
      value={{
        themesArray,
        activeTheme,
        setActiveContextTheme: setActiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
