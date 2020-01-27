import styled from "styled-components";

const VideoAndChatContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 10000;
`;

const StyledChat = styled.iframe`
  height: 100vh;
  border: none;
  right: 0;
  position: fixed;
  width: ${props => props.width || "9vw"};
`;
const StyledVideo = styled.iframe`
  width: ${props => props.width || "91vw"};
  height: 100vh;

  border: none;
  /* right: 0;
  position: fixed; */
`;

const ResizeDevider = styled.div`
  background: red;
  width: 2px;
  cursor: w-resize;
  z-index: 5000;
  position: absolute;
  height: 100vh;
  left: ${props => props.left};
`;

export { VideoAndChatContainer, StyledChat, StyledVideo, ResizeDevider };
