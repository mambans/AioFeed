import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";
import styled, { keyframes } from "styled-components";

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
    color: ${({ selected }) => (selected ? "#ffffff" : "inherit")};
    font-weight: ${({ selected }) => (selected ? "bold" : "unset")};
  }
`;

export const StyledShowAllButton = styled.li`
  cursor: pointer;
  justify-content: center !important;
  font-weight: bold;
  font-size: 1.1rem;
`;

export const GameListUlContainer = styled.ul`
  transform: translate3d(0, 0, 0);
  color: rgb(230, 230, 230);
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  background: var(--popupListsBackground) !important;
  box-shadow: var(--refreshButtonShadow);
  width: 310px;
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;

  border-radius: 0 0 10px 10px !important;
  max-height: 485px;
  height: 485px;
  overflow: scroll;
  overflow-x: scroll;
  overflow-x: hidden;
  border: none !important;
  z-index: 4;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: thin solid #1e1616;
    padding: 5px 0;
    transform: translate3d(0, 0, 0);

    /* min-height: 43px; */
  }

  a {
    transform: translate3d(0, 0, 0);
    transition: color 50ms, font-weight 50ms;
    color: inherit;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const BackdropChannelList = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  transition: 175ms;
  left: 0;
  top: 0;
  z-index: 3;
`;

export const TypeListUlContainer = styled.ul`
  color: white;
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  background: var(--popupListsBackground) !important;
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
  height: 42px;

  div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
    transform: translate3d(0, 0, 0);
    /* padding: 5px 0px;
    min-height: 42px; */
  }
`;

export const SearchGameForm = styled.form`
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border-radius: 5px;
  transition: width 250ms, min-width 250ms, margin-left 250ms;
  width: ${({ open }) => (open ? "310px" : "125px")};
  min-width: ${({ open }) => (open ? "310px" : "125px")};
  margin-left: ${({ open }) => (open ? "0px" : "185px")};
  z-index: 4;

  li {
    button.VodButton,
    svg.StreamFollowBtn,
    button.StreamUpdateNoitificationsButton {
      opacity: 1;
    }
  }

  &:focus-within {
    width: 310px;
    min-width: 310px;
    margin-left: 0px;
  }

  input {
    padding: 0.5rem 25px 0.5rem 0.75rem;
    color: var(--refreshButtonColor);
    background: transparent;
    border: none;
    border-radius: 5px;
    text-overflow: ellipsis;
    width: calc(100% - (26px + 1.5rem));
    position: relative;
    z-index: 5;
  }

  svg#ToggleListBtn {
    /* padding: 0.5em 0.75em; */
    padding: 7px;
    cursor: pointer;
    position: absolute;
    color: var(--refreshButtonColor);
    transition: color 250ms;
    z-index: 4;

    &:hover {
      color: #ffffff;
    }
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

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 20 })``;

const SearchSubmitA = styled.a`
  position: absolute;
  cursor: pointer;
  color: rgb(240, 240, 240);
  display: flex;
  margin-left: calc(310px - 72px);
  margin-top: -29px;
  z-index: 5;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

const SearchSubmitLink = styled(Link)`
  position: absolute;
  cursor: pointer;
  color: rgb(240, 240, 240);
  display: flex;
  margin-left: calc(310px - 72px);
  margin-top: -29px;
  z-index: 5;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

export const SearchSubmitBtn = ({ href, to }) =>
  href ? (
    <SearchSubmitA href={href}>
      <SearchSubmitIcon />
    </SearchSubmitA>
  ) : (
    <SearchSubmitLink to={to}>
      <SearchSubmitIcon />
    </SearchSubmitLink>
  );
