import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";

import { VideoAndChatContainer, StyledVideo, ToggleNavbarButton } from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

export default () => {
  document.title = "Notifies | Clip";
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  let { id } = useParams();

  useEffect(() => {
    setShrinkNavbar("true");
    setFooterVisible(false);
  }, [setShrinkNavbar, setFooterVisible]);

  return (
    <VideoAndChatContainer
      id='twitch-embed'
      style={{
        height: visible ? "calc(100vh - 50px)" : "100vh",
        top: visible ? "50px" : "0",
        display: "unset",
      }}>
      <ToggleNavbarButton
        icon={visible ? ic_vertical_align_top : ic_vertical_align_bottom}
        title={visible ? "Hide navbar" : "Show navbar"}
        style={{ right: "10px" }}
        onClick={() => {
          setVisible(!visible);
        }}
      />
      <StyledVideo
        src={`https://clips.twitch.tv/embed?clip=${id}`}
        height='100%'
        width='100%'
        frameborder='0'
        allowfullscreen='true'
        scrolling='no'
        preload='auto'></StyledVideo>
    </VideoAndChatContainer>
  );
};
