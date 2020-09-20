import React, { useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ThemeSelector, ThemeSelectorUl, ThemeItem, Arrow } from './styledComponents';
import ThemeContext, { findSeasonOrDefaultTheme } from './ThemeContext';
import useSyncedLocalState from './../../hooks/useSyncedLocalState';

export default ({ style }) => {
  const { themesArray, setActiveContextTheme } = useContext(ThemeContext);
  const [activeTheme, setActiveTheme] = useSyncedLocalState('activeTheme', {
    name: 'default',
    type: 'dark',
  });
  const [open, setOpen] = useState(false);

  const activateTheme = (theme) => {
    document.documentElement.classList.add('theme-transition');
    document.body.classList.add('theme-transition');

    if (theme.name === 'default') {
      const activatingTheme = findSeasonOrDefaultTheme(themesArray);
      document.documentElement.setAttribute('data-theme', activatingTheme.name || 'default');
    } else {
      document.documentElement.setAttribute('data-theme', theme.name);
    }
    window.setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
      document.body.classList.remove('theme-transition');
    }, 1000);
  };

  return (
    <ThemeSelector open={open} style={style}>
      <button
        id='active'
        // onBlur={() => {
        //   setOpen(false);
        // }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span id='prefix'>Theme:</span>
        <Arrow open={open} />
        <span id='ActiveThemeName'>
          {activeTheme.name.charAt(0).toUpperCase() + activeTheme.name.slice(1)}
        </span>
      </button>
      <div style={{ overflow: 'hidden' }}>
        <CSSTransition in={open} timeout={500} classNames='themeSelector' unmountOnExit>
          <ThemeSelectorUl>
            {themesArray.map((theme) => {
              return (
                <ThemeItem
                  key={theme.name}
                  value={theme.name}
                  image={
                    theme.image
                      ? typeof theme.image === 'function'
                        ? `${process.env.PUBLIC_URL}/images/${theme.image(themesArray).image}`
                        : `${process.env.PUBLIC_URL}/images/${theme.image}`
                      : 'none'
                  }
                  backgroundColor={theme.backgroundColor ? theme.backgroundColor : 'unset'}
                  onClick={() => {
                    setActiveTheme(theme);
                    activateTheme(theme);
                    if (theme.type !== activeTheme.type) setActiveContextTheme(theme);
                    setOpen(false);
                  }}
                >
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </ThemeItem>
              );
            })}
          </ThemeSelectorUl>
        </CSSTransition>
      </div>
    </ThemeSelector>
  );
};
