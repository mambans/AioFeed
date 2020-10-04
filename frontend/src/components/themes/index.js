import { getLocalstorage } from '../../util/Utils';

import { findSeasonOrDefaultTheme } from './ThemeContext';

export default async (themesArray) => {
  const savedActiveTheme = getLocalstorage('activeTheme');

  if (!savedActiveTheme || savedActiveTheme.name === 'default') {
    const activatingTheme = findSeasonOrDefaultTheme(themesArray);

    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', activatingTheme.name || 'default');
    window.setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
    }, 1000);
    return savedActiveTheme;
  } else {
    console.log('Theme:', savedActiveTheme.name);
    document.documentElement.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', savedActiveTheme.name);
    window.setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
    }, 1000);
    return savedActiveTheme;
  }
};
