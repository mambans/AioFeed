import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { VideoAndChatContainer, StyledChat, StyledVideo } from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

const EMBED_URL = "https://embed.twitch.tv/embed/v1.js";

const TwitchInteractivePlayer = ({ id }) => {
  document.title = `Notifies | ${id}`;
  useEffect(() => {
    let embed;
    const script = document.createElement("script");
    script.setAttribute("src", EMBED_URL);
    let TwitchPlayer = new window.Twitch.Embed("twitch-embed", {
      width: "100%",
      height: "100%",
      video: id,
      theme: "dark",
      // layout: "video",
    });

    script.addEventListener("load", () => {
      embed = TwitchPlayer;
      var player = embed.getPlayer();
    });

    document.body.appendChild(script);
    // window.TwitchPlayer.setVolume(0.5);
  }, [id]);

  return null;
};

export default () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  let { id } = useParams();

  useEffect(() => {
    setVisible(false);
    setFooterVisible(false);
  }, [setVisible, setFooterVisible]);

  return (
    <VideoAndChatContainer id='twitch-embed'>
      <TwitchInteractivePlayer id={id} />
    </VideoAndChatContainer>
  );
};
