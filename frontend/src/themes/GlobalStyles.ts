import { ThemeType } from "../stores/theme/themeStore";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }
    html {
        box-sizing: border-box;
    }

  body {
    	margin: 0;

    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.50s linear;

    &.modal-open {
      overflow: hidden;
    }
  }

  a {
		transition: color 250ms, font-weight 250ms;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }

    &.active {
			color: ${({ theme }) => theme.colors.accent};
			font-weight: 600;
		}
  }

  label {
    color: ${({ theme }) => theme.colors.label};
    font-size: 0.9rem;
  }

  button {

    &:not([disabled]) {
      cursor: pointer;
    }
  }
`;
