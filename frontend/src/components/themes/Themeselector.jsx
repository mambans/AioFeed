import React, { useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ThemeSelector, ThemeSelectorUl, ThemeItem, Arrow } from './styledComponents';
import ThemeContext from './ThemeContext';

const Themeselector = ({ style }) => {
  const { themesArray, setActiveTheme, activeTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  return (
    <ThemeSelector open={open} style={style} image={activeTheme.image}>
      <button id='active' onClick={() => setOpen(!open)}>
        <span id='prefix'>Theme:</span>
        <Arrow open={open} />
        <span id='ActiveThemeName'>
          {activeTheme.name.charAt(0).toUpperCase() + activeTheme.name.slice(1)}
        </span>
      </button>
      <div style={{ overflow: 'hidden' }}>
        <CSSTransition in={open} timeout={500} classNames='themeSelector' unmountOnExit>
          <ThemeSelectorUl>
            {themesArray.map((theme) => (
              <ThemeItem
                key={theme.name}
                value={theme.name}
                image={theme.image || 'none'}
                backgroundColor={theme.backgroundColor ? theme.backgroundColor : 'unset'}
                onClick={() => {
                  if (theme) setActiveTheme(theme);
                  setOpen(false);
                }}
              >
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </ThemeItem>
            ))}
          </ThemeSelectorUl>
        </CSSTransition>
      </div>
    </ThemeSelector>
  );
};

export default Themeselector;
