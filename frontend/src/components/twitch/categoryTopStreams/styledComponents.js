import styled, { keyframes } from "styled-components";
import { Button } from "react-bootstrap";

export const StyledGameListElement = styled.li`
  justify-content: unset;
  cursor: pointer;

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 3px;
  }

  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 262px;
  }
`;

export const StyledShowAllButton = styled.li`
  cursor: pointer;
  justify-content: center !important;
  font-weight: bold;
  font-size: 1.1rem;
`;

export const GameListUlContainer = styled.ul`
  color: white;
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  background: linear-gradient(rgba(0, 0, 0, 0.4) 0%, var(--popupModalBackground) 15%) !important;
  box-shadow: var(--refreshButtonShadow);
  width: 250px;
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;

  border-radius: 0 0 10px 10px !important;
  max-height: 485px;
  height: 485px;
  overflow: scroll;
  overflow-x: scroll;
  overflow-x: hidden;
  border: none !important;
  z-index: 3;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: thin solid #1e1616;
    padding: 5px 0;
    min-height: 43px;
  }

  a {
    color: rgb(200, 200, 200);

    &:hover {
      color: #ffffff;
    }
  }
`;

export const TypeListUlContainer = styled.ul`
  color: white;
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  background: linear-gradient(rgba(0, 0, 0, 0.4) 0%, var(--popupModalBackground) 15%) !important;
  box-shadow: var(--refreshButtonShadow);
  width: 150px;
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;

  border-radius: 0 0 10px 10px !important;
  /* max-height: 485px;
  height: 485px; */
  overflow: scroll;
  overflow-x: scroll;
  overflow-x: hidden;
  border: none !important;
  z-index: 3;

  li {
    display: grid;
    grid-template-columns: 35% auto;
    align-items: center;
    border-bottom: thin solid #1e1616;
    padding: 5px 0;
    min-height: 43px;
    cursor: pointer;
  }

  a {
    color: rgb(200, 200, 200);

    &:hover {
      color: #ffffff;
    }
  }
`;

export const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

export const StyledLoadingListElement = styled.li`
  div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
  }
`;

export const SearchGameForm = styled.form`
  margin-right: 25px;

  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border-radius: 5px;
  width: 250px;

  input {
    padding: 0.5rem 0.75rem;
    color: var(--refreshButtonColor);
    background: transparent;
    border: none;
    border-radius: 5px;
    text-overflow: ellipsis;
    width: calc(250px - (26px + 1.5rem));
  }

  svg {
    /* padding: 0.5em 0.75em; */
    padding: 7px;
    cursor: pointer;
    position: absolute;
  }
`;

export const TypeButton = styled(Button).attrs({ variant: "dark" })`
  width: 150px;
  background-color: rgba(20, 23, 25, 0.5);
  display: grid;
  grid-template-columns: 35% auto;
  text-align: unset;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover,
  &:active,
  &:focus {
    background-color: rgba(20, 23, 25, 0.9);
  }

  svg {
    padding-right: 5px;
  }
`;

export const TopDataSortButtonsContainer = styled.div`
  display: flex;
  justify-content: right;
  width: 675px;
  min-width: 675px;

  div {
    margin: 0 10px;
  }

  button {
    height: 42px;
  }
`;

export const HeaderContainer = styled.div`
  border-bottom: var(--subFeedHeaderBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  width: 92.1%;
  margin: auto;
  margin-top: 25px;

  @media screen and (max-width: 2560px) {
    width: 82.5% !important;
  }

  @media screen and (max-width: 1920px) {
    width: 92% !important;
  }
`;

export const TopStreamsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 92.1%;
  margin: auto;

  @media screen and (max-width: 2560px) {
    width: 82.5% !important;
  }

  @media screen and (max-width: 1920px) {
    width: 92% !important;
  }
`;
