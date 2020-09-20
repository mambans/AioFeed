import styled from 'styled-components';

export const ThemeSelector = styled.div`
  margin: 10px 0;

  button#active {
    background: rgba(0, 0, 0, 0.25);
    margin: 0;
    display: flex;
    align-items: center;
    height: 2.2rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition: border-radius 250ms, background 250ms, background-color 250ms,
      background-image 250ms;
    border-radius: ${({ open }) => (open ? '10px 10px 0 0 ' : '10px')};
    width: 100%;
    border: none;
    outline: 0;
    color: rgb(200, 200, 203);
    display: grid;
    grid-template-columns: 18% 4% 78%;
    position: relative;
    border: thin solid rgba(255, 255, 255, 0.14);

    &:before {
      content: '';
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
      border-radius: ${({ open }) => (open ? '10px 10px 0 0 ' : '10px')};
    }

    &:hover {
      background: ${({ open }) => (open ? 'transparent' : 'rgba(0,0,0,0.1)')};
      color: rgb(255, 255, 255);
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
  background: rgba(0, 0, 0, 0.3);
  margin: auto;
  border-radius: 0 0 10px 10px;
  position: relative;
  font-weight: bold;
`;

export const Arrow = styled.i`
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  background: transparent;
  border-color: var(--textColor1Hover);
  transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(-45deg)')};
  transition: transform 350ms;
  grid-column: 2;
  width: 3px;
`;

export const ThemeItem = styled.li`
  background-image: ${({ image }) => `url(${image})`};
  background-color: ${({ backgroundColor }) => backgroundColor};
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: center;
  text-shadow: 1px 1px 1px black;

  padding: 7px 0 7px 10px;
  cursor: pointer;
  color: rgb(200, 200, 203);

  &:hover {
    color: rgb(255, 255, 255);
    text-shadow: 2px 2px 2px black;
  }
`;
