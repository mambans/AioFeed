import styled from 'styled-components';
import { MdFormatIndentDecrease } from 'react-icons/md';
import { pulse } from './../StyledComponents';

export const SidebarTitlePopup = styled.div`
  /* width: 325px; */
  /* height: 62px; */
  position: fixed;
  background: var(--navigationbarBackground);
  /* z-index: 5; */
  z-index: -1;
  left: 0;

  /* span {
    padding: 8px 0;
    width: inherit;
    height: inherit;
    display: block;
    line-height: 25px;
    color: rgb(200, 200, 200);
    font-size: 0.92rem;
    overflow: hidden;
  }

  div {
    height: 1px;
    background: #aaaaaa;
    width: 0px;
    transition: width 1s cubic-bezier(0.32, 0.5, 0.17, 0.6);
  }

  &:hover {
    div {
      width: 320px;
    }
  } */
`;

export const Styledsidebar = styled.div`
  width: 275px !important;
  background: var(--sidebarsBackgroundColor);
  top: 92px;
  position: fixed;
  border-radius: 10px 10px 0 0;
  overflow: auto;
  scrollbar-color: #232526 transparent !important;
  scrollbar-width: thin !important;
  max-height: calc(100vh - (65px + 50px));
  padding-bottom: 2px;
  z-index: 2;
  left: 0;
`;

export const SidebarHeader = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--textColor2);
  padding: 8px 5px 8px 10px;
  border-bottom: 2px solid #2f2f2f;
  height: 50.5px;
  margin-bottom: 0;
  justify-content: center;
  display: flex;
  align-items: center;
`;

export const StyledsidebarItem = styled.div`
  display: grid;
  /* grid-template-areas: "profile user  viewers" "profile row2 row2"; */
  grid-template-areas: 'profile user  user' 'profile row2 row2';
  grid-template-columns: 18% 56% 26%;
  grid-template-rows: 50% 50%;
  padding: 8px 5px 8px 10px;
  border-bottom: 1px solid #3d3d3d;
  transition: ease-in-out 1s,
    box-shadow ${({ duration }) => (duration ? 1 : 2)}s cubic-bezier(0.07, 0.81, 0.13, 0.9);
  font-size: 0.9rem;
  position: relative;
  height: 62px;
  box-shadow: -276px 0 1px 1px #aaaaaa;

  &:hover {
    box-shadow: 0 0 1px 1px #aaaaaa;
  }

  a {
    height: max-content;
  }

  .profileImage {
    grid-area: profile;
    align-self: center;

    img {
      width: 36px;
      grid-area: profile;
      border-radius: 20px;
    }
  }

  p {
    margin: 0;
  }

  .sidebarGame {
    color: rgb(150, 150, 150);
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--textColor2);
  }

  .sidebarUser {
    color: var(--textColor2);
    font-weight: bold;
    margin-right: 8px;
    font-size: 1.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebarViewers {
    color: var(--textColor2);
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    font-size: 1.05em;
    align-items: center;
    min-width: 70px;
    margin-left: 5px;

    i {
      justify-content: right !important;
    }
  }

  .sidebarDuration {
    color: var(--textColor2);
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 70px;
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    i {
      justify-content: right;
    }
  }
`;

export const LoadingSidebarItems = styled.div`
  display: grid;
  grid-template-areas: 'profile channel' 'profile game';
  grid-template-columns: 18% auto;
  grid-template-rows: 50% 50%;
  padding: 8px 5px 8px 10px;
  border-bottom: 1px solid #2f2f2f;
  position: relative;
  height: 62px;

  .Profile {
    grid-area: profile;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);
    align-self: center;
  }

  .Channel {
    grid-area: channel;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);
    margin: 4px 0;
    border-radius: 9px;
    width: ${({ channelWidth }) => channelWidth};
  }

  .Game {
    grid-area: game;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);
    margin: 4px 0;
    border-radius: 9px;
    width: ${({ gameWidth }) => gameWidth};
  }
`;

export const HideSidebarButton = styled(MdFormatIndentDecrease).attrs({ size: 25.5 })`
  position: fixed;
  height: 50.5px;
  transition: opacity 500ms, transform 350ms;
  color: #ffffff;
  background: none;
  opacity: 0.3;
  transform: ${({ show }) => (show === 'true' ? 'unset' : 'rotateY(180deg)')};
  cursor: pointer;
  left: 3px;
  top: 92px;
  z-index: 3;

  &:hover {
    opacity: 1;
  }
`;

export const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  grid-area: user;

  svg {
    color: rgb(120, 120, 120);
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
`;

export const SecondRow = styled.div`
  grid-area: row2;
  padding-top: 0px;
  display: flex;
  justify-content: space-between;
  /* display: grid; */
  /* grid-template-columns: auto 33%; */

  svg {
    color: rgb(120, 120, 120);
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
`;
