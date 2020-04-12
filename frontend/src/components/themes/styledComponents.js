import styled from "styled-components";

export const ThemeSelector = styled.div`
  label {
    min-width: 250px;
    width: 100%;
  }
  select {
    border: none;
    color: black;
    border-radius: 5px;
  }

  select {
    background: var(--themeSelectorBackgroundColor)
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
      no-repeat right 0.75rem center/8px 10px;
  }
`;
