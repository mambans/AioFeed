import React, { useContext } from 'react';
import styled from 'styled-components';
import { FaInfoCircle, FaWindowClose } from 'react-icons/fa';
import {
  MdMovieCreation,
  MdLoop,
  MdMore,
  MdCompareArrows,
  MdChat,
  MdVerticalAlignBottom,
  MdAccountCircle,
  MdViewWeek,
} from 'react-icons/md';
import { Button, Nav } from 'react-bootstrap';
import { GrRefresh } from 'react-icons/gr';
import { Link, NavLink } from 'react-router-dom';
import NavigationContext from '../../navigation/NavigationContext';
import { IconContainer } from '../../myLists/StyledComponents';
import { BottomDiv } from './Chat';

export const VideoAndChatContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: ${({ visible }) => (visible ? 'calc(100vh - 70px)' : '100vh')};
  top: ${({ visible }) => (visible ? '70px' : '0')};
  transition: top 250ms, height 250ms;
  display: grid;
  transform: translate3d(0, 0, 0);
  grid-template-areas: ${({ switchedChatState, hidechat, chatAsOverlay }) =>
    hidechat || chatAsOverlay
      ? '"video"'
      : switchedChatState === 'true'
      ? '"chat devider video"'
      : '"video devider chat"'};
  color: var(--navTextColorActive);
  cursor: ${({ resizeActive }) => (resizeActive ? 'w-resize' : 'unset')};
  will-change: ${({ resizeActive }) => (resizeActive ? 'contents' : 'auto')};
  grid-template-columns: ${({ chatwidth, hidechat, switched, chatAsOverlay }) =>
    `${
      hidechat || chatAsOverlay
        ? '100vw'
        : switched
        ? `${chatwidth}px min-content auto`
        : `auto min-content ${chatwidth}px`
    } `};
  background: linear-gradient(217deg, rgba(45, 45, 45, 0.8), rgba(10, 10, 10, 0.7) 70.71%),
    linear-gradient(127deg, rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.7) 70.71%),
    linear-gradient(336deg, rgba(30, 30, 30, 0.8), rgba(0, 0, 0, 0.7) 70.71%);

  div#twitch-embed {
    grid-area: video;
  }

  .IframeContainer {
    width: 100%;
    height: 100%;
  }

  ${IconContainer} {
    opacity: 0;
  }

  &:hover {
    #switchSides {
      opacity: 0.6;
    }

    .listVideoButton {
      opacity: 1;
    }

    ${IconContainer} {
      opacity: 1;
    }
  }
`;

export const StyledChat = styled.iframe`
  height: 100%;
  border: none;
  width: 100%;
`;

export const StyledVideo = styled.iframe`
  width: ${({ width }) => width || '91vw'};
  border: none;
`;

export const ToggleSwitchChatSide = styled(MdCompareArrows).attrs({ size: 30 })`
  cursor: pointer;
  transition: opacity 250ms;
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;

  &:hover {
    &&& {
      opacity: 1;
    }
  }
`;

export const PlayerNavbar = styled.div`
  background: #0000005c;
  position: fixed;
  top: 10px;
  left: 50%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  z-index: 3;
  transform: translateX(-50%);
  padding: 0 10px;

  button,
  a.btn {
    margin: 2px 20px;
    transition: background-color 200ms, border-color 200ms, color 200ms, box-shadow 200ms;
    padding: 0px 6px;

    background-color: #26292f8a;
    border-color: #26292f8a;
    box-shadow: 3px 3px 2px #161515d4;
    color: var(--navTextColor);

    &:hover:not([disabled]) {
      box-shadow: 4px 4px 2px #161515ed;
      color: #fff;
      background-color: #23272b;
      border-color: #1d2124;
    }
  }

  a,
  p {
    &&& {
      font-size: 1rem;
    }
    color: var(--navTextColor);
    padding: 0;
    display: flex;
    transition: color 200ms;
    align-items: center;
    margin: 0 20px;

    &:hover {
      color: #ffffff;
    }

    svg {
      &&& {
        display: flex;
      }
      transition: color 200ms;
      display: flex;
      align-items: center;
      padding-right: 7px;
    }
  }

  .linkWithIcon:not([disabled]) {
    svg {
      color: #720072;
    }

    &:hover svg {
      color: #ae02ae;
    }
  }

  .linkWithIcon[disabled] {
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const VolumeText = styled.div`
  font-size: 3rem;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 1px rgb(0, 0, 0);
  opacity: 0;
  transition: opacity 500ms;

  svg {
    margin: 0 15px;
    margin-top: 5px;
  }
`;

//VolumeEventOverlay
// const VEO_margin_top = 175;
const VEO_margin_bottom = 150;

export const StyledVolumeEventOverlay = styled.div`
  position: absolute;
  width: ${({ type, hidechat, chatwidth, chatAsOverlay, isFullscreen }) =>
    hidechat === 'true' || chatAsOverlay === 'true' || isFullscreen === 'true'
      ? '98vw'
      : type === 'live'
      ? `${window.innerWidth * 0.98 - chatwidth}px`
      : '98vw'};
  height: ${({ vodVolumeOverlayEnabled }) =>
    vodVolumeOverlayEnabled ? `calc(100% - ${VEO_margin_bottom}px)` : '100%'};
  bottom: ${({ type }) => (type === 'live' ? 'unset' : '70px')};
  cursor: ${({ showcursor }) => (showcursor ? 'auto' : 'none')};
  display: ${({ centerBotttom }) => (centerBotttom ? 'flex' : 'block')};
  align-self: center;
  pointer-events: ${({ show, hidePointerEvents }) => (!hidePointerEvents ? 'all' : 'none')};

  transition: background-color 500ms, box-shadow 500ms;

  margin: auto;
  margin-top: 'auto';
  margin-bottom: ${({ vodVolumeOverlayEnabled }) =>
    vodVolumeOverlayEnabled ? VEO_margin_bottom + 'px' : 'auto'};

  justify-content: ${({ centerBotttom }) => centerBotttom && 'center'};
  align-items: ${({ centerBotttom }) => centerBotttom && 'end'};

  * {
    pointer-events: auto;
  }

  a,
  p {
    text-shadow: 0 0 2px black;
  }

  #PausePlay {
    color: #f4f4f49c;
    cursor: pointer;
    transition: color 150ms;
    margin: 5px 10px;

    &:hover {
      color: #ffffff;
    }
  }

  svg,
  p#showQualities {
    opacity: 0.7;
    transition: opacity 300ms;

    &:hover {
      opacity: 1;
    }
  }

  &:hover {
    & ${VolumeText} {
      opacity: 1;
    }
  }

  &.fade-controllUI-1s-enter {
    opacity: 0;
    transition: opacity 1000ms;
  }

  &.fade-controllUI-1s-enter-active {
    opacity: 1;
    transition: opacity 1000ms;
  }

  &.fade-controllUI-1s-exit {
    opacity: 1;
    transition: opacity 500ms;
  }

  &.fade-controllUI-1s-exit-active {
    opacity: 0;
    transition: opacity 500ms;
  }

  &.fade-controllUI-1s-exit-done {
    opacity: 0;
    transition: opacity 500ms;
  }
`;

export const StyledVolumeSlider = styled.div`
  width: 230px;
  text-align: center;
  display: grid;
  grid-template-areas: 'spacer text' 'slider slider';
  grid-template-columns: 45px auto;
  margin: 5px 10px;

  .value {
    margin-bottom: 0;
    grid-area: text;
    text-shadow: 0 0 5px black;
    position: relative;
    height: 35px;

    h3 {
      position: absolute;
      min-width: 30px;
      left: ${({ left }) => left}px;
      transform: translateX(-50%);
    }
  }

  input {
    cursor: pointer;
  }

  svg#icon {
    color: #f4f4f49c;
    margin-right: 15px;
    cursor: pointer;
  }

  &:hover {
    svg#icon {
      color: #ffffff;
    }
  }

  #BottomRow {
    display: flex;
    grid-area: slider;
    align-items: center;
  }

  .rangeslider-horizontal {
    height: 12px;
    border-radius: 6px;
  }

  .rangeslider {
    background-color: ${({ volumeMuted }) => (volumeMuted ? '#841010a1' : '#6b6b6b')};
    margin: 9px 0;
    width: calc(100% - 30px);
    cursor: pointer;
  }

  .rangeslider-horizontal .rangeslider__fill {
    background-color: ${({ volumeMuted }) => (volumeMuted ? '#bd0202' : '#42b38e')};
    border-radius: 6px;
  }
`;

export const InfoDisplay = styled.div`
  display: grid;
  grid-template-areas: 'logo name' 'logo title' 'logo game' 'logo viewers' 'logo uptime' 'logo tags';
  grid-template-columns: 75px auto;
  max-width: 500px;
  background: #00000080;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0px 0px 9px 3px #0000009c;
  position: absolute;
  /* margin: 5px; */

  p {
    margin: 0;
  }

  a {
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }

  img.profile {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    grid-area: logo;
  }

  #name {
    grid-area: name;
    font-size: 1.3rem;
    font-weight: bold;
  }

  #title {
    grid-area: title;
  }

  #game {
    grid-area: game;
    width: max-content;
    img {
      width: 1.625em;
    }
  }

  #viewers {
    grid-area: viewers;
    width: max-content;
  }

  #uptime {
    grid-area: uptime;
    width: max-content;
  }

  #tags {
    grid-area: tags;
    /* width: max-content; */
  }

  .twitchRedirect {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

export const ButtonShowStats = styled(FaInfoCircle).attrs({ size: 24 })`
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 5px 10px;
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;

  &:hover {
    opacity: 1;
  }
`;

export const ButtonShowQualities = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 5px 10px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-right: 7px;
  }
`;

export const QualitiesList = styled.ul`
  width: max-content;
  position: absolute;
  bottom: 50px;
  font-weight: bold;
  cursor: pointer;
  margin: 5px;
  list-style: none;
  background: #00000080;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #0000009c;

  li {
    padding: 2px;
    color: rgb(200, 200, 200);

    &:hover {
      color: #ffffff;
    }
  }
`;

export const PlaybackStats = styled.div`
  width: max-content;
  padding: 10px;
  border-radius: 10px;
  bottom: 80px;
  position: absolute;

  background: #00000080;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #0000009c;
`;

export const HideChatButton = styled(FaWindowClose).attrs({ size: 26, color: 'red' })`
  position: absolute;
  bottom: 100px;
  opacity: 0.5;
  cursor: pointer;
  right: ${({ switched }) => (switched === 'true' ? 'unset' : '10px')};
  left: ${({ switched }) => (switched === 'true' ? '10px' : 'unset')};
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;
`;

export const OpenChatButton = styled(MdChat).attrs({ size: 26, color: 'white' })`
  position: absolute;
  bottom: 100px;
  opacity: 0.5;
  cursor: pointer;
  right: ${({ switched }) => (switched === 'true' ? 'unset' : '10px')};
  left: ${({ switched }) => (switched === 'true' ? '10px' : 'unset')};
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;
`;

export const CreateClipButton = styled(MdMovieCreation).attrs({ size: 24, color: 'white' })`
  opacity: 0.7;
  cursor: pointer;
  margin: 5px 10px;
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;
`;

export const StyledPlayerExtraButtons = styled.div`
  transition: transform 250ms, opacity 500ms;
  transform: translateX(100%) translateX(-49px);
  /* opacity: 1; */
  width: max-content;
  position: absolute;
  z-index: 1;
  padding: 5px;
  right: 0;
  display: flex;
  align-items: center;
  border-radius: 10px;
  opacity: 0.75;

  svg {
    padding: 2px;
    margin-right: 4px;
  }

  &:hover,
  &:focus-within {
    transform: translateX(0);
    opacity: 1;
    z-index: 1;
  }

  a,
  .link {
    color: #fff;
    background-color: #343a40;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    margin: 4px;
    cursor: pointer;
    /* opacity: 0.7; */
    overflow: hidden;
    border: none;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:hover {
      opacity: 1;
      color: #fff;
      background-color: #23272b;
      border-color: #1d2124;
      text-decoration: none;
    }
  }
`;

const PlayerExtraButtonsTrigger = styled(MdMore).attrs({ size: 36 })`
  color: white;
  margin-right: 8px;
`;
const PlayerExtraButtonsTrigger1 = styled(MdViewWeek).attrs({ size: 26 })`
  color: #646464;
  position: absolute;
  transform: translateX(9px);
  margin-right: 0 !important;
`;

export const PlayerExtraButtons = ({ channelName, children }) => {
  const { visible, setVisible } = useContext(NavigationContext);

  return (
    <StyledPlayerExtraButtons>
      <PlayerExtraButtonsTrigger />
      <PlayerExtraButtonsTrigger1 />
      <StyledShowNavbarBtn onClick={() => setVisible(!visible)}>
        <MdVerticalAlignBottom
          style={{
            transform: visible ? 'rotateX(180deg)' : 'unset',
            right: '10px',
          }}
          size={26}
          title='Show navbar'
        />
        Nav
      </StyledShowNavbarBtn>
      {children}
      {channelName && (
        <Link className='link' to={`/${channelName}/page`}>
          <MdAccountCircle size={26} /> Page
        </Link>
      )}
    </StyledPlayerExtraButtons>
  );
};

export const StyledShowNavbarBtn = styled(Button).attrs({ variant: 'dark' })`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin: 4px;
  cursor: pointer;
  overflow: hidden;
  border: none;
  border-radius: 0.2rem;
  background: rgba(33, 37, 41, 0.75);

  svg {
    min-width: 30px;
  }
`;

export const ResizeDevider = styled.div`
  height: 100%;
  cursor: w-resize;
  grid-area: devider;
  transition: background 500ms;
  background: ${({ resizeActive }) => (resizeActive ? 'rgb(40,40,40)' : '#121314')};
  display: flex;
  transform: translate3d(0, 0, 0);
  position: absolute;
  z-index: 3;

  > div {
    transition: opacity 500ms, height 250ms;
    opacity: ${({ resizeActive }) => (resizeActive ? 1 : 0.4)};
    background: #ffffff;
    width: 3px;
    margin: auto;
    height: ${({ resizeActive }) => (resizeActive ? '40%' : '10%')};
  }

  &:hover > div {
    transition: opacity 250ms, height 500ms;
    opacity: 1;
    height: 40%;
  }
`;

export const ChatOverlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  transform: translate3d(0, 0, 0);
  z-index: 5;
`;

export const ResetVideoButton = styled(GrRefresh).attrs({ size: 24 })`
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 5px 10px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;

  path {
    stroke: var(--navTextColorActive);
  }

  &:hover {
    opacity: 1;
  }

  svg {
    margin-right: 7px;
  }
`;

export const SmallButtonContainer = styled.div`
  align-items: end;
  display: grid;
  grid-auto-flow: column;
  position: absolute;
  bottom: 10px;

  *[disabled] {
    opacity: 0.2;
    pointer-events: none;

    &:hover {
      opacity: 0.3;
      pointer-events: none;
    }
  }
`;

export const ChannelIconLink = styled(Nav.Link).attrs({ as: NavLink })`
  color: rgb(240, 240, 240);
  margin-right: 10px;
  border-radius: 5px;
  transition: color 200ms, background 200ms;
  font-size: 1rem;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 0;
  opacity: 0.7;

  svg {
    margin-right: 5px;
  }

  &:hover {
    &&& {
      text-decoration: none;
    }
    color: rgb(255, 255, 255);
    opacity: 1;
  }
`;

export const LoopBtn = styled(MdLoop)`
  /* position: absolute; */
  /* right: ${({ listIsOpen, listWidth }) => (listIsOpen === 'true' ? listWidth : '15')}px; */
  /* right: 15px; */
  /* bottom: ${({ enabled }) => (enabled === 'true' ? '150px' : '90px')}; */
  cursor: pointer;
  opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.3')};
  margin: 15px;
  transition: opacity 250ms;
`;

export const LoopTimebarBackground = styled.div`
  width: 100%;
  height: 15px;
  background: #1e1e1e;
  position: relative;
`;
export const LoopTimebarContainer = styled.div`
  width: calc(100% - 4em);
  /* position: fixed; */
  /* bottom: 90px; */
  /**To match Twitch Iframe font-size for the padding*/
  font-size: 62.5%;
  margin-left: 2em;
  opacity: ${({ active }) => (active ? 1 : 0.2)};
  transition: opacity 500ms;

  &:hover {
    opacity: 1;
  }
`;

export const LoopTimebarEnabled = styled.div`
  height: 100%;
  background: #393939;
  width: ${({ width }) => width};
  /* left: ${({ start }) => (start ? '0px' : 'unset')};
  right: ${({ start }) => (start ? '0px' : 'unset')}; */
  position: absolute;
  left: ${({ left }) => left}px;
  /* cursor: pointer; */

  p#loopedDuration {
    position: absolute;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25em;
    transition: opacity 250ms;
    width: calc(100% - 20px);
    margin: 0;
    margin-left: 10px;
    user-select: none;
  }

  &:hover {
    p#loopedDuration {
      opacity: 1;
    }
  }
`;

export const LoopPins = styled.div`
  height: 200%;
  background: ${({ active }) => (active ? 'white' : '#9b9b9b')};
  width: 10px;
  position: absolute;
  cursor: pointer;
  transform: translateY(-25%);
  z-index: 1;

  &:hover {
    background: white;
    p {
      opacity: 1;
    }
  }

  p {
    opacity: ${({ active }) => (active ? 1 : 0)};
    transition: opacity 100ms;
    color: white;
    position: absolute;
    transform: translate3d(-25%, -125%, 0);
    background: #3e3e3ef0;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 1rem;
    pointer-events: none;
  }
`;

export const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

export const Loop = styled.div`
  position: fixed;
  bottom: 90px;
  width: ${({ listIsOpen, listWidth, loopEnabled }) =>
    listIsOpen === 'true'
      ? `calc(100% - ${listWidth}px )`
      : loopEnabled === 'true'
      ? '100%'
      : 'auto'};
`;

export const ChatContainer = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  height: ${({ visible }) => (visible ? 'calc(100vh - 70px)' : '100vh')};
  top: ${({ visible }) => (visible ? '70px' : '0')};
  transition: top 250ms, height 250ms;
`;

export const TagsContainer = styled.div`
  display: flex;
  justify-content: start;
  transform: translateX(-5px);
  padding: 5px;
  grid-area: 'tags';
  flex-wrap: wrap;
  gap: 10px;

  a,
  p {
    padding: 2px 4px;
    background: rgb(41, 41, 41) none repeat scroll 0% 0%;
    border-radius: 5px;
    font-size: 0.8em;
  }
`;

export const ErrorMessage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p {
    font-size: 1.3em;
  }
`;

export const ChatHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* background: var(--navigationbarBackground); */
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  padding: ${({ show }) => (show ? '0.5rem' : '0')};
  height: ${({ show }) => (show ? 45 : 0)}px;
  overflow: hidden;
  transition: height 250ms, padding 250ms;

  button {
    background: none;
    border: none;
    transition: color 250ms, filter 250ms;

    &.chat__close-button {
      opacity: 0.35;
    }

    &:hover {
      opacity: 1;
      filter: brightness(1.2);
    }
  }

  a {
    transition: color 250ms, filter 250ms;
    color: rgba(255, 255, 255, 0.75);

    &:hover {
      color: #ffffff;
      filter: brightness(1.2);
    }
  }

  svg {
    transition: fill 250ms, filter 250ms;
    fill: rgba(255, 255, 255, 0.75);

    &:hover {
      fill: #ffffff;
      filter: brightness(1.2);
    }
  }

  path {
    transition: stroke 250ms, filter 250ms;
    stroke: rgba(255, 255, 255, 0.75);

    &:hover {
      stroke: #ffffff;
      filter: brightness(1.2);
    }
  }
`;

export const ChatWrapper = styled.div`
  grid-area: ${({ chatAsOverlay }) => (chatAsOverlay ? 'none' : 'chat')};
  height: ${({ chatAsOverlay, overlayPosition }) =>
    chatAsOverlay ? (overlayPosition.height ? overlayPosition.height + 'px' : '50%') : '100%'};
  width: ${({ chatAsOverlay, overlayPosition }) =>
    chatAsOverlay ? (overlayPosition.width ? overlayPosition.width + 'px' : 'unset') : 'unset'};
  position: ${({ chatAsOverlay }) => (chatAsOverlay ? 'absolute' : 'initial')};
  overflow: hidden;
  box-shadow: ${({ dragging }) => (dragging ? '0 0 1px 1px rgb(150,150,150)' : 'none')};
  top: ${({ overlayPosition }) =>
    overlayPosition.y
      ? Math.min(
          window.innerHeight - (overlayPosition.height || 0),
          Math.max(0, overlayPosition.y)
        ) + 'px'
      : 'initial'};
  left: ${({ overlayPosition }) =>
    overlayPosition.x
      ? Math.min(window.innerWidth - (overlayPosition.width || 0), Math.max(0, overlayPosition.x)) +
        'px'
      : 'initial'};

  max-height: 100%;
  max-width: 100%;
  min-height: 1px;
  min-width: 1px;
  display: flex;
  flex-direction: column;
  overflow: visible;
  border-left: 1px solid transparent;
  background: var(--navigationbarBackground);

  &:hover {
    ${BottomDiv} {
      height: 25px;
    }
    ${ChatHeader} {
      height: 45px;
      padding: 0.5rem;
    }
  }
`;

export const ChatHeaderInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  z-index: 1;
`;
