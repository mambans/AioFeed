import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { MdMovieCreation } from "react-icons/md";

const VideoAndChatContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: calc(100vh - 50px);
  top: 50px;
  transition: top 300ms, height 300ms;
  display: grid;
  grid-template-areas: ${({ switchedChatState }) =>
    switchedChatState === "true"
      ? '"chat video"'
      : switchedChatState === "hide"
      ? "video"
      : '"video chat"'};

  &:hover #switchSides {
    opacity: 0.6;
  }

  div#twitch-embed {
    width: ${({ hidechat }) => (hidechat === "true" ? "100vw" : "91vw")};
    grid-area: video;
  }

  div#chat {
    grid-area: chat;
  }

  #ToggleNavbarButton {
    position: absolute;
    z-index: 1;
    padding: 5px;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 300ms, transform 300ms;
    padding-top: 10px;

    &:hover {
      opacity: 1;
    }
  }
`;

const StyledChat = styled.iframe`
  height: 100%;
  border: none;
  /* right: 0;
  position: fixed; */
  width: ${({ width }) => width || "9vw"};
`;

const StyledVideo = styled.iframe`
  width: ${({ width }) => width || "91vw"};
  border: none;
`;

const ToggleSwitchChatSide = styled(MdCompareArrows).attrs({ size: 30 })`
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: opacity 300ms;
  /* opacity: 0; */
  bottom: 60px;
  /* margin-left: ${({ switched }) => (switched === "true" ? "10px" : "calc(91vw - 40px)")}; */
  right: ${({ switched }) => (switched === "true" ? "unset" : "10px")};
  left: ${({ switched }) => (switched === "true" ? "10px" : "unset")};

  &:hover {
    opacity: 1 !important;
  }
`;

const PlayerNavbar = styled.div`
  height: 25px;
  /* background: var(--navigationbarBackground); */
  background: #0000005c;
  /* text-align: center; */
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  align-self: center;

  a {
    color: var(--headerTextColor);
    padding: 0;
    font-size: 1rem !important;
    display: flex;
    transition: color 200ms;
    align-items: center;

    &:hover {
      color: #ffffff;
    }

    svg {
      display: flex;
      align-items: center;
      padding-right: 7px;
      display: flex !important;
    }
  }
`;

const VolumeEventOverlay = styled.div`
  position: absolute;
  width: ${({ type, hidechat }) =>
    hidechat === "true" ? "99vw" : type === "live" ? "90vw" : "100vw"};
  /* width: ${({ hideChat }) => (hideChat === "true" ? "99vw" : "90vw")}; */
  height: 100%;
  bottom: ${({ type }) => (type === "live" ? "unset" : "70px")};
  opacity: 0;
  transition: opacity 500ms 0ms;

  a, p {
    text-shadow: 0 0 2px black;
  }

  &:hover {
    opacity: 1 !important ;
    transition: opacity 250ms 0s;
  }

  #PausePlay {
  color: #f4f4f49c;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  transition: color 150ms;
  margin: 5px 10px;

    &:hover {
      color: #ffffff;
    }

  }

  svg, p#showQualities {
    opacity: 0.7;
    transition: opacity 300ms;

    &:hover {
      opacity: 1;
    }
  }
`;

const StyledVolumeSlider = styled.div`
  width: 230px;
  text-align: center;
  bottom: 10px;
  position: absolute;
  left: 50px;
  display: grid;
  grid-template-areas: "spacer text" "slider slider";
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
    /* background: #6b6b6b; */
    background-color: ${({ volumeMuted }) => (volumeMuted ? "#841010a1" : "#6b6b6b")};
    margin: 9px 0;
    width: calc(100% - 30px);
    cursor: pointer;
  }

  .rangeslider-horizontal .rangeslider__fill {
    /* background-color: #42b38e; */
    background-color: ${({ volumeMuted }) => (volumeMuted ? "#bd0202" : "#42b38e")};
    border-radius: 6px;
  }
`;

// const PausePlay = styled(props => (props.ispaused === "true" ? FaPlay : FaPause)).attrs({
// const PausePlay = styled(props => (props.ispaused === "true" ? FaPlay : FaPause)).attrs({
//   size: 30,
// })`
//   color: #f4f4f49c;
//   cursor: pointer;
//   position: absolute;
//   bottom: 10px;
//   transition: color 150ms;
//   margin: 5px 10px;

//   &:hover {
//     color: #ffffff;
//   }
// `;

// const PausePlayOverlay = styled(props => (props.ispaused === "true" ? FaPlay : FaPause)).attrs({
//   size: 70,
// })`
//   color: white;
//   cursor: pointer;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   justify-content: center;
//   display: flex !important;
//   align-items: center;
//   background: rgba(0, 0, 0, 0.5);
// `;

const InfoDisplay = styled.div`
  display: grid;
  grid-template-areas: "logo name" "logo title" "logo game" "logo viewers" "logo uptime";
  grid-template-columns: 75px auto;
  /* width: 400px; */
  max-width: 600px;
  background: #00000080;
  padding: 15px 15px 5px 15px;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #0000009c;
  position: absolute;

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
    height: 65px;
    width: 65px;
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
  }

  #viewers {
    grid-area: viewers;
  }

  #uptime {
    grid-area: uptime;
  }
`;

// const ButtonShowStats = styled(Icon).attrs({ icon: infoCircle, size: 26 })`
const ButtonShowStats = styled(FaInfoCircle).attrs({ size: 24 })`
  position: absolute;
  bottom: 12px;
  margin: 0;
  font-weight: bold;
  left: 315px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 5px 10px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const ButtonShowQualities = styled.p`
  position: absolute;
  bottom: 12px;
  margin: 0;
  font-weight: bold;
  left: 400px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 5px 10px;
  opacity: 0.7;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-right: 7px;
  }
`;

const QualitiesList = styled.ul`
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

const PlaybackStats = styled.div`
  width: max-content;
  padding: 10px;
  border-radius: 10px;
  bottom: 80px;
  position: absolute;

  background: #00000080;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #0000009c;
`;

// const StyledHideChatButton = styled(({ hideChat }) =>
//   hideChat === "true" ? MdCompareArrows : FaWindowClose
// ).attrs({ size: 26, color: "red" })`

const HideChatButton = styled(FaWindowClose).attrs({ size: 26, color: "red" })`
  position: absolute;
  bottom: 100px;
  opacity: 0.5;
  cursor: pointer;
  right: 10px;
`;

const OpenChatButton = styled(MdChat).attrs({ size: 26, color: "white" })`
  position: absolute;
  bottom: 100px;
  opacity: 0.5;
  cursor: pointer;
  right: 10px;
`;

const CreateClipButton = styled(MdMovieCreation).attrs({ size: 24, color: "white" })`
  position: absolute;
  /* right: 45px; */
  left: 360px;
  bottom: 12px;
  opacity: 0.7;
  cursor: pointer;
  margin: 5px 10px;
`;

export {
  VideoAndChatContainer,
  StyledChat,
  ToggleSwitchChatSide,
  PlayerNavbar,
  VolumeEventOverlay,
  StyledVolumeSlider,
  InfoDisplay,
  ButtonShowStats,
  PlaybackStats,
  StyledVideo,
  ButtonShowQualities,
  QualitiesList,
  HideChatButton,
  OpenChatButton,
  CreateClipButton,
};
