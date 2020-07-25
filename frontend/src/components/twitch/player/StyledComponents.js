import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';
import { MdCompareArrows } from 'react-icons/md';
import { FaWindowClose } from 'react-icons/fa';
import { MdChat } from 'react-icons/md';
import { MdMovieCreation } from 'react-icons/md';
import { Button, Nav } from 'react-bootstrap';
import { GrRefresh } from 'react-icons/gr';
import { NavLink } from 'react-router-dom';

export const VideoAndChatContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: calc(100vh - 50px);
  top: 50px;
  transition: top 300ms, height 300ms;
  display: grid;
  transform: translate3d(0, 0, 0);
  grid-template-areas: ${({ switchedChatState, hidechat }) =>
    hidechat
      ? '"video"'
      : switchedChatState === 'true'
      ? '"chat devider video"'
      : '"video devider chat"'};
  color: var(--navTextColorActive);
  cursor: ${({ resizeActive }) => (resizeActive ? 'w-resize' : 'unset')};
  grid-template-columns: ${({ chatwidth, hidechat, switched }) =>
    `${hidechat ? '100vw' : switched ? `${chatwidth}px 5px auto` : `auto 5px ${chatwidth}px`} `};
  background: linear-gradient(217deg, rgba(45, 45, 45, 0.8), rgba(10, 10, 10, 0.7) 70.71%),
    linear-gradient(127deg, rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.7) 70.71%),
    linear-gradient(336deg, rgba(30, 30, 30, 0.8), rgba(0, 0, 0, 0.7) 70.71%);

  &:hover #switchSides {
    opacity: 0.6;
  }

  div#twitch-embed {
    grid-area: video;
  }

  div#chat {
    grid-area: chat;
  }

  .IframeContainer {
    width: 100%;
    height: 100%;
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
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: opacity 300ms;
  bottom: 60px;
  right: ${({ switched }) => (switched === 'true' ? 'unset' : '10px')};
  left: ${({ switched }) => (switched === 'true' ? '10px' : 'unset')};
  background: rgba(0, 0, 0, 0.25) none repeat scroll 0% 0%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px 1px;

  &:hover {
    opacity: 1 !important;
  }
`;

export const PlayerNavbar = styled.div`
  background: #0000005c;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  align-self: center;

  top: 10px;
  position: fixed;
  width: 450px;
  left: 50%;
  margin-left: -225px;
  height: 50px;
  border-radius: 25px;
  z-index: 3;

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
    color: var(--navTextColor);
    padding: 0;
    font-size: 1rem !important;
    display: flex;
    transition: color 200ms;
    align-items: center;
    margin: 0 20px;

    &:hover {
      color: #ffffff;
    }

    svg {
      transition: color 200ms;
      display: flex;
      align-items: center;
      padding-right: 7px;
      display: flex !important;
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

export const VolumeEventOverlay = styled.div`
  position: absolute;
  width: ${({ type, hidechat, chatwidth }) =>
    hidechat === 'true'
      ? '100vw'
      : type === 'live'
      ? `${window.innerWidth - chatwidth}px`
      : '100vw'};
  height: 100%;
  bottom: ${({ type }) => (type === 'live' ? 'unset' : '70px')};
  cursor: ${({ showcursor }) => (showcursor ? 'auto' : 'none')};
  display: ${({ show }) => (show ? 'block' : 'none')};

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
`;

export const StyledVolumeSlider = styled.div`
  width: 230px;
  text-align: center;
  display: grid;
  grid-template-areas: 'spacer text' 'slider slider';
  grid-template-columns: 60px auto;
  margin: 5px 10px;

  h3 {
    margin-bottom: 0;
    grid-area: text;
    text-shadow: 0 0 5px black;
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
    /* background-color: #42b38e; */
    background-color: ${({ volumeMuted }) => (volumeMuted ? '#bd0202' : '#42b38e')};
    border-radius: 6px;
  }
`;

export const InfoDisplay = styled.div`
  display: grid;
  grid-template-areas: 'logo name' 'logo title' 'logo game' 'logo viewers' 'logo uptime';
  grid-template-columns: 75px auto;
  /* width: 400px; */
  max-width: 500px;
  background: #00000080;
  padding: 10px 10px 5px;
  border-radius: 10px;
  box-shadow: 0px 0px 9px 3px #0000009c;
  position: absolute;
  margin: 5px;

  p {
    margin: 0;
  }

  a {
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
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
  }

  #viewers {
    grid-area: viewers;
    width: max-content;
  }

  #uptime {
    grid-area: uptime;
    width: max-content;
  }

  .twitchRedirect {
    margin-left: 10px;
  }
`;

// export const ButtonShowStats = styled(Icon).attrs({ icon: infoCircle, size: 26 })`
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
  left: 415px;
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

// export const StyledHideChatButton = styled(({ hideChat }) =>
//   hideChat === "true" ? MdCompareArrows : FaWindowClose
// ).attrs({ size: 26, color: "red" })`

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

export const ShowNavbarBtn = styled(Button)`
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 1;
  padding: 5px;
  margin: 4px;
  cursor: pointer;
  opacity: 0.4;
  right: ${({ type }) => (type === 'video' ? '10px' : 'unset')};
  transition: opacity 250ms, transform 250ms, width 250ms;
  overflow: hidden;
  width: 40px;
  border: none;
  transform: translate3d(0, 0, 0);

  svg {
    min-width: 30px;
    margin-right: 5px;
  }

  &::after {
    content: 'Nav';
    transition: all 200ms;
  }

  &:hover {
    opacity: 1;
    width: 80px;
  }
`;

export const NavigateBack = styled(Button)`
  /* left: 0;
  position: absolute; */
`;

export const ResizeDevider = styled.div`
  height: 100%;
  cursor: w-resize;
  grid-area: devider;
  transition: background 500ms;
  background: ${({ resizeActive }) => (resizeActive ? 'rgb(40,40,40)' : '#121314')};
  display: flex;
  transform: translate3d(0,0,0);

  > div {
    transition: opacity 500ms, height 250ms;
    opacity: ${({ resizeActive }) => (resizeActive ? 1 : 0.4)};
    background: #ffffff;
    width: 1px;
    margin: auto;
    /* height: ${({ resizeActive, videowidth }) =>
      resizeActive ? `${(videowidth / 1.777777777777778).toFixed(0)}px` || '25%' : '5%'}; */
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
  /* width: ${({ videowidth }) => `calc(100vw - ${videowidth}px)`}; */
  width: ${({ chatwidth }) => chatwidth}px;
  position: absolute;
  transform: translate3d(0, 0, 0);
  grid-area: chat;
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

export const ChannelButton = styled(Button)`
  position: absolute;
  color: rgb(240, 240, 240);
  /* top: 115px; */
  padding: 5px 10px;
  background: #313131b8;
  margin: 15px 0 0 250px;
  border-radius: 5px;
  transition: color 200ms, background 200ms;
  opacity: 0.5;

  &:hover {
    color: rgb(255, 255, 255);
    background: #3c3c3cb8;
    opacity: 1;
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
    color: rgb(255, 255, 255);
    opacity: 1;
    text-decoration: none !important;
  }
`;
