import React, { useContext, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

import { ThemeSelector, ThemeSelectorUl } from "./styledComponents";
import ThemeContext from "./ThemeContext";
import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

const Arrow = styled.i`
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  background: transparent;
  border-color: var(--textColor1Hover);
  transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(-45deg)")};
  transition: transform 350ms;
  grid-column: 2;
  width: 3px;
`;

export default ({ style }) => {
  const { themesArray, setActiveContextTheme } = useContext(ThemeContext);
  const [activeTheme, setActiveTheme] = useSyncedLocalState("activeTheme", {
    name: "default",
    type: "dark",
    startMonth: 0,
    startDate: 0,
    endMonth: 0,
    endDate: 0,
  });
  const [open, setOpen] = useState(false);

  const activateTheme = (theme) => {
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");

    if (theme.name === "default") {
      const currentMonth = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();

      const startTheme = themesArray.find((themes) => {
        return (
          themes.startMonth <= currentMonth &&
          themes.endMonth >= currentMonth &&
          themes.startDate <= currentDate &&
          themes.endDate >= currentDate
        );
      });

      document.documentElement.setAttribute(
        "data-theme",
        startTheme
          ? startTheme.name
          : themesArray.find((themes) => {
              return themes.default;
            }).name
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme.name);
    }
    window.setTimeout(function () {
      document.documentElement.classList.remove("theme-transition");
      document.body.classList.remove("theme-transition");
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
        }}>
        <span id='prefix'>Theme:</span>
        <Arrow open={open} />
        <span id='ActiveThemeName'>
          {activeTheme.name.charAt(0).toUpperCase() + activeTheme.name.slice(1)}
        </span>
      </button>
      <div style={{ overflow: "hidden" }}>
        <CSSTransition in={open} timeout={500} classNames='themeSelector' unmountOnExit>
          <ThemeSelectorUl>
            {themesArray.map((theme) => {
              return (
                <li
                  key={theme.name}
                  value={theme.name}
                  onClick={() => {
                    setActiveTheme(theme);
                    activateTheme(theme);
                    if (theme.type !== activeTheme.type) setActiveContextTheme(theme);
                    setOpen(false);
                  }}>
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </li>
              );
            })}
          </ThemeSelectorUl>
        </CSSTransition>
      </div>
    </ThemeSelector>
  );
};
