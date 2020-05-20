import styled from "styled-components";

export const ThemeSelector = styled.div`
  margin: 10px 0;

  button#active {
    /* background: ${({ open }) => (open ? "rgba(25, 29, 32, 1)" : "rgba(25, 29, 32, 0)")}; */
    background: rgba(0,0,0,0.25);
    margin: 0;
    display: flex;
    align-items: center;
    height: 2rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    cursor: pointer;
    /* border-radius: 10px; */
    transition: border-radius 250ms, background 250ms;
    border-radius: ${({ open }) => (open ? "10px 10px 0 0 " : "10px")};
    width: 100%;
    border: none;
    outline: 0;
    color:var(--textColor1);
    display: grid;
    /* grid-template-columns: 0% 100%; */
    grid-template-columns: 18% 4% 78%;
    position: relative;
    border: thin solid rgba(255, 255, 255, 0.14);
    /* background-image: var(--backgroundImg); */

    &:before {
      content: "";
      background-image: var(--backgroundImg);
      opacity: 1;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
      background-size: cover;
      background-repeat: no-repeat;
      background-position-y: center;
      transition: border-radius 250ms, background 250ms;
      border-radius: ${({ open }) => (open ? "10px 10px 0 0 " : "10px")};
    }

    &:hover {
      background: ${({ open }) => (open ? "transparent" : "rgba(0,0,0,0.1)")};
      color:var(--textColor1Hover);
    }

    span#prefix {
      grid-column: 1;
      padding-left: 2px;
    }

    span#ActiveThemeName {
      margin-left: -24%;
    }
  }
`;

export const ThemeSelectorUl = styled.ul`
  list-style: none;
  padding: 0;
  /* background: rgb(25, 29, 32); */
  background: rgba(0, 0, 0, 0.3);
  margin: auto;
  border-radius: 0 0 10px 10px;
  position: relative;

  li {
    padding: 5px 0 5px 10px;
    cursor: pointer;
    color: var(--textColor2);

    &:hover {
      color: var(--textColor1Hover);
    }
  }
`;
