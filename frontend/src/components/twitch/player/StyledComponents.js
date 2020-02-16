import styled from "styled-components";
import Icon from "react-icons-kit";
import { loop } from "react-icons-kit/icomoon/loop";

const VideoAndChatContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: calc(100vh - 50px);
  top: 50px;
  transition: top 300ms, height 300ms;
  display: grid;
  grid-template-areas: ${({ switchedChatState }) =>
    switchedChatState === "true" ? '"chat video"' : '"video chat"'};

  &:hover #switchSides {
    opacity: 0.6;
  }

  div#twitch-embed {
    width: 91vw;
    grid-area: video;
  }

  div#chat {
    grid-area: chat;
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

const ResizeDevider = styled.div`
  background: red;
  width: 2px;
  cursor: w-resize;
  z-index: 5000;
  position: absolute;
  height: 100%;
  left: ${({ left }) => left};
`;

const ToggleNavbarButton = styled(Icon).attrs({
  size: 30,
  // icon: props => props.state || ic_vertical_align_bottom,
})`
  position: absolute;
  z-index: 1;
  padding: 5px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 300ms;
  padding-top: 10px;

  &:hover {
    opacity: 1;
  }
`;

const ToggleSwitchChatSide = styled(Icon).attrs({ size: 30, icon: loop })`
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: opacity 300ms;
  opacity: 0;
  bottom: 100px;
  margin-left: ${({ switched }) => (switched === "true" ? "10px" : "calc(91vw - 40px)")};

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

  a.nav-link {
    color: var(--headerTextColor);
    padding: 0;
    font-size: 1rem !important;
    display: flex;
    transition: color 200ms;

    &:hover {
      color: #ffffff;
    }

    div#icon {
      display: flex;
      align-items: center;
    }

    i {
      padding-right: 7px;
      display: flex !important;
    }
  }
`;

const VolumeEventOverlay = styled.div`
  position: absolute;
  width: ${({ type }) => (type === "live" ? "91vw" : "100vw")};
  height: ${({ type }) => (type === "live" ? "calc(100% - 275px)" : "calc(100% - 270px)")};
  bottom: ${({ type }) => (type === "live" ? "150px" : "180px")};

  p {
    font-size: 1.5rem;
    text-shadow: 0px 0px 1px black;
    /* background: #00000012; */
    width: max-content;
    padding: 10px;
    position: absolute;
    bottom: 0;
    opacity: 0;
    transition: opacity 500ms 3s ease;
    display: flex;
    align-items: center;

    i {
      display: flex;
      padding-right: 5px;
    }
  }

  .vlCtrl {
    position: absolute;
    width: 27rem;
    bottom: 0;
    padding: 5px 20px;
    transition: opacity 500ms 3s ease;
    opacity: 0;
    display: flex;
    align-items: center;

    i {
      padding-right: 2px;
      color: #f4af0a;
    }

    svg,
    path {
      user-select: none;
      overflow: visible;
    }
    .volElem {
      fill: none;
      stroke-width: 5;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
    }
  }

  &:hover {
    p,
    .vlCtrl {
      opacity: 1;
      transition: opacity 500ms 0s ease;
    }
  }
`;

export {
  VideoAndChatContainer,
  StyledChat,
  StyledVideo,
  ResizeDevider,
  ToggleNavbarButton,
  ToggleSwitchChatSide,
  PlayerNavbar,
  VolumeEventOverlay,
};
