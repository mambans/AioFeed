import styled from 'styled-components';
import { pulse } from './../StyledComponents';
import { TransparentButton } from '../../../components/styledComponents';

export const SidebarInfoPopup = styled.div`
  position: fixed;
  background: var(--navigationbarBackground);
  z-index: -1;
  left: 0;

  &.sidebarInfoPopup-enter {
    opacity: 0;
    transform: translate3d(200px, 0, 0);
    transition: opacity 200ms cubic-bezier(0.79, 0.17, 0.73, 0.24),
      transform 300ms cubic-bezier(0.23, 0.82, 0, 0.7);
  }

  &.sidebarInfoPopup-enter-active {
    opacity: 1;
    transform: translate3d(275px, 0, 0);
    transition: opacity 200ms cubic-bezier(0.79, 0.17, 0.73, 0.24),
      transform 300ms cubic-bezier(0.23, 0.82, 0, 0.7);
  }

  &.sidebarInfoPopup-exit {
    opacity: 1;
    transform: translate3d(275px, 0, 0);
    transition: opacity 200ms cubic-bezier(0.79, 0.17, 0.73, 0.24),
      transform 300ms cubic-bezier(0.23, 0.82, 0, 0.7);
  }

  &.sidebarInfoPopup-exit-active {
    opacity: 0;
    /* transform: translate3d(200px, 0, 0); */
    transition: opacity 200ms cubic-bezier(0.79, 0.17, 0.73, 0.24),
      transform 300ms cubic-bezier(0.23, 0.82, 0, 0.7);
  }

  &.sidebarInfoPopup-enter-done {
    transform: translate3d(275px, 0, 0);
    opacity: 1;
    transition: opacity 200ms cubic-bezier(0.79, 0.17, 0.73, 0.24),
      transform 300ms cubic-bezier(0.23, 0.82, 0, 0.7);
  }
`;

export const Styledsidebar = styled.div`
  width: 275px;
  scrollbar-color: #232526 transparent;
  scrollbar-width: thin;
  position: fixed;
  overflow: auto;
  max-height: calc(100vh - (60px + 50px));
  padding-bottom: 2px;
  z-index: 2;
  left: 0;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  -ms-overflow-style: none !important;
  scrollbar-width: none !important;

  &::-webkit-scrollbar {
    display: none !important;
  }

  &.twitchSidebar-appear {
    opacity: 0;
    left: -275px !important;
    transition: opacity 500ms, left 750ms;
  }
  &.twitchSidebar-appear-active {
    opacity: 1;
    left: 0 !important;
    transition: opacity 500ms, left 750ms;
  }
  &.twitchSidebar-appear-done {
    opacity: 1;
    left: 0 !important;
    transition: opacity 500ms, left 750ms;
  }

  &.twitchSidebar-enter {
    opacity: 0;
    left: -275px !important;
    transition: opacity 500ms, left 750ms;
  }
  &.twitchSidebar-enter-done {
    opacity: 1;
    left: 0 !important;
    transition: opacity 500ms, left 750ms;
  }

  &.twitchSidebar-enter-active {
    opacity: 1;
    left: 0 !important;
    transition: opacity 500ms, left 750ms;
  }

  &.twitchSidebar-exit {
    opacity: 1;
    left: 0 !important;
    transition: opacity 500ms, left 750ms;
  }

  &.twitchSidebar-exit-active {
    opacity: 0;
    left: -275px !important;
    transition: opacity 500ms, left 750ms;
  }

  &.twitchSidebar-exit-done {
    opacity: 0;
    left: -275px !important;
    transition: opacity 500ms, left 750ms;
  }
`;

export const SidebarHeader = styled.header`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--textColor2);
  padding: 8px 5px 8px 10px;
  border-bottom: 2px solid var(--subFeedHeaderBorder);
  height: 50.5px;
  margin-bottom: 0;
  justify-content: center;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledsidebarItem = styled.div`
  display: grid;
  grid-template-areas: 'profile user  user' 'profile row2 row2';
  grid-template-columns: 18% 56% 26%;
  grid-template-rows: 50% 50%;
  padding: 8px 5px 8px 10px;
  border-bottom: 1px solid var(--subFeedHeaderBorder);
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

    p {
      justify-content: space-between;
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
  border-bottom: 1px solid var(--subFeedHeaderBorder);
  position: relative;
  height: 62px;

  .Profile {
    grid-area: profile;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    animation: ${pulse} 2s linear infinite;
    align-self: center;
  }

  .Channel {
    grid-area: channel;
    animation: ${pulse} 2s linear infinite;
    margin: 4px 0;
    border-radius: 9px;
    width: ${({ channelWidth }) => channelWidth};
  }

  .Game {
    grid-area: game;
    animation: ${pulse} 2s linear infinite;
    margin: 4px 0;
    border-radius: 9px;
    width: ${({ gameWidth }) => gameWidth};
  }
`;

export const HideSidebarButton = styled(TransparentButton)`
  position: fixed;
  height: 50.5px;
  transition: opacity 500ms, transform 350ms, top 350ms, left 350ms;
  color: #ffffff;
  background: none;
  opacity: 0.3;
  transform: ${({ show }) => (show === 'true' ? 'unset' : 'rotateY(180deg)')};
  cursor: pointer;
  left: 5px;
  top: 92px;
  z-index: 3;
  align-items: center;

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

  svg {
    color: rgb(120, 120, 120);
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
`;

export const StyledSidebarSection = styled.section`
  order: ${({ order }) => order};
  background: var(--sidebarsBackgroundColor);
  border-radius: 10px 10px 0 0;
  box-shadow: 0 9px 0px 0px transparent, 0 -9px 0px 0px transparent, 12px 0 15px -4px #00000030,
    -12px 0 15px -4px #00000030;
`;
