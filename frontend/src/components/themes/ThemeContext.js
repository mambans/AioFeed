import React from 'react';

import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const themesArray = [
    {
      name: 'clean',
      type: 'dark',
      image: 'webp/clean.webp',
    },
    {
      name: 'coffee beans',
      type: 'dark',
      image: 'webp/felix-coffee-dimmed.webp',
    },
    {
      name: 'coffee',
      type: 'dark',
      image: 'webp/coffee.webp',
    },
    {
      name: 'coffeepour',
      type: 'dark',
      image: 'webp/coffeepour-blurred-remasted.webp',
      default: true,
    },
    {
      name: 'leafs',
      type: 'dark',
      image: 'webp/leafs.webp',
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
      name: 'matt blue',
      type: 'dark',
      image: 'webp/matt_blue.webp',
    },
    {
      name: 'dark',
      type: 'dark',
      backgroundColor: '#101216',
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

  const [activeTheme, setActiveTheme] = useSyncedLocalState(
    'activeTheme',
    themesArray.find((themes) => themes.default) || themesArray[0]
  );

  const prepareThemeSwitch = (theme) => {
    document.documentElement.classList.add('theme-transition');
    document.body.classList.add('theme-transition');
    document.getElementById('AppContainer').classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', theme.name || 'default');

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
      document.body.classList.remove('theme-transition');
      document.getElementById('AppContainer').classList.remove('theme-transition');
    }, 1000);
  };

  return (
    <ThemeContext.Provider
      value={{
        themesArray,
        activeTheme,
        setActiveTheme: (theme) => {
          prepareThemeSwitch(theme);
          setActiveTheme(theme);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
