import styled, { keyframes } from "styled-components";

const StyledGameListElement = styled.li`
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

const StyledShowAllButton = styled.li`
  cursor: pointer;
  justify-content: center !important;
  font-weight: bold;
  font-size: 1.1rem;
`;

const GameListUlContainer = styled.ul`
  color: white;
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  background: linear-gradient(rgba(0, 0, 0, 0.4) 0%, var(--popupModalBackground) 15%) !important;
  box-shadow: var(--refreshButtonShadow);
  width: 300px;
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

const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

const StyledLoadingListElement = styled.li`
  div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
  }
`;

const SearchGameForm = styled.form`
  margin-right: 25px;

  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border-radius: 5px;
  width: 300px;

  input {
    padding: 0.5rem 0.75rem;
    color: var(--refreshButtonColor);
    background: transparent;
    border: none;
    border-radius: 5px;
    text-overflow: ellipsis;
    width: calc(300px - (26px + 1.5rem));
  }

  svg {
    /* padding: 0.5em 0.75em; */
    padding: 7px;
    cursor: pointer;
    position: absolute;
  }
`;

export {
  StyledGameListElement,
  StyledShowAllButton,
  GameListUlContainer,
  StyledLoadingListElement,
  SearchGameForm,
};
