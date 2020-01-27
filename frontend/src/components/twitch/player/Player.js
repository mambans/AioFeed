import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { VideoAndChatContainer, StyledChat, StyledVideo } from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

export default () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  let { channel } = useParams();

  useEffect(() => {
    setVisible(false);
    setFooterVisible(false);
  }, [setVisible, setFooterVisible]);

  return (
    <VideoAndChatContainer>
      <StyledVideo
        // url={`https://player.twitch.tv/?channel=${data.data.user_name}&muted=true`}
        src={`https://player.twitch.tv/?twitch5=1&channel=${channel}&autoplay=true&muted=false`}
        title={channel + "-iframe"}
        theme='dark'
        id={channel + "-iframe"}
        height='100vh'
        allowFullScreen={true}
        frameBorder='0'
        loading={"Loading.."}
      />
      <StyledChat
        frameborder='0'
        scrolling='yes'
        theme='dark'
        id={channel + "-chat"}
        src={`https://www.twitch.tv/embed/${channel}/chat?darkpopout`}></StyledChat>
    </VideoAndChatContainer>
  );
};
