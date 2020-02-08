import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
  import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
  import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";

import {
  VideoAndChatContainer,
  StyledChat,
  ToggleNavbarButton,
  ToggleSwitchChatSide,
} from "./StyledComponents";
import NavigationContext from "./../../navigation/NavigationContext";

const EMBED_URL = "https://embed.twitch.tv/embed/v1.js";

const TwitchInteractivePlayer = ({ channel, video }) => {
  useEffect(() => {
    let embed;
    const script = document.createElement("script");
    script.setAttribute("src", EMBED_URL);
    let TwitchPlayer = new window.Twitch.Embed("twitch-embed", {
      width: "100%",
      height: "100%",
      theme: "dark",
      layout: "video",
      channel: channel,
      video: video,
    });

    script.addEventListener("load", () => {
      embed = TwitchPlayer;
      var player = embed.getPlayer();
    });

    document.body.appendChild(script);
    // window.TwitchPlayer.setVolume(0.5);
  }, [channel, video]);

  return null;
};

export default () => {
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const location = useLocation();
  const type = location.pathname.split("/")[2];
  let { id } = useParams();
  const [switched, setSwitched] = useState(false);

  document.title = ` ${id} | Notifies`;

  useEffect(() => {
    // setVisible(false);
    setShrinkNavbar("true");
    setFooterVisible(false);
  }, [setShrinkNavbar, setFooterVisible]);

  if (type === "live") {
    return (
      <VideoAndChatContainer
        style={{
          height: visible ? "calc(100vh - 50px)" : "100vh",
          top: visible ? "50px" : "0",
        }}
        switchedChatState={switched}>
        <div style={{ width: "91vw", gridArea: "video" }} id='twitch-embed'>
          <TwitchInteractivePlayer channel={id} />
          <ToggleSwitchChatSide
            id='switchSides'
            style={{ marginLeft: switched ? "10px" : "calc(91vw - 40px)" }}
            onClick={() => {
              setSwitched(!switched);
            }}
          />
        </div>
        <div style={{ gridArea: "chat" }}>
          <ToggleNavbarButton
            icon={visible ? ic_vertical_align_top : ic_vertical_align_bottom}
            title={visible ? "Hide navbar" : "Show navbar"}
            onClick={() => {
              setVisible(!visible);
            }}
          />
          <StyledChat
            frameborder='0'
            scrolling='yes'
            theme='dark'
            id={id + "-chat"}
            src={`https://www.twitch.tv/embed/${id}/chat?darkpopout`}
          />
        </div>
      </VideoAndChatContainer>
    );
  } else if (type === "video") {
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
        <TwitchInteractivePlayer video={id} />
      </VideoAndChatContainer>
    );
  }
};
