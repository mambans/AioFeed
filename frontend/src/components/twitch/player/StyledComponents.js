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
  grid-template-areas: ${props => (props.switchedChatState ? '"chat video"' : '"video chat"')};

  &:hover #switchSides {
    opacity: 0.6;
  }
`;

const StyledChat = styled.iframe`
  height: 100%;
  border: none;
  /* right: 0;
  position: fixed; */
  width: ${props => props.width || "9vw"};
`;

const StyledVideo = styled.iframe`
  width: ${props => props.width || "91vw"};
  border: none;
`;

const ResizeDevider = styled.div`
  background: red;
  width: 2px;
  cursor: w-resize;
  z-index: 5000;
  position: absolute;
  height: 100%;
  left: ${props => props.left};
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
  bottom: 50px;

  &:hover {
    opacity: 1 !important;
  }
`;

export {
  VideoAndChatContainer,
  StyledChat,
  StyledVideo,
  ResizeDevider,
  ToggleNavbarButton,
  ToggleSwitchChatSide,
};
