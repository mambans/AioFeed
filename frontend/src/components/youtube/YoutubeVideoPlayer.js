import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import YouTube from "react-youtube";
import { MdVerticalAlignBottom } from "react-icons/md";
import React, { useContext, useEffect } from "react";
// import queryString from "query-string";

import NavigationContext from "./../navigation/NavigationContext";
import { VideoAndChatContainer, ShowNavbarBtn } from "./../twitch/player/StyledComponents";
import PlayerNavbar from "./PlayerNavbar";

const StyledYoutubeIframe = styled(YouTube)`
  border: none;
  height: 100%;
  width: 100%;
`;

// const VideoInfoContainer = styled.div`
//   position: absolute;
//   background: rgba(25, 25, 25, 0.5);
//   border-radius: 10px;
//   position: absolute;
//   bottom: 60px;
//   left: 10px;

//   p {
//     padding: 5px 10px;
//     margin: 0;
//   }
// `;

export default () => {
  const videoId = (() => {
    const param = useParams().videoId;
    if (param.includes("&t=")) {
      return param.split("&t=")[0];
    } else {
      return param;
    }
  })();
  const locationPathname = useLocation().pathname;
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  const startTime = (() => {
    if (locationPathname.includes("&t=")) {
      return locationPathname.split("&t=")[1].replace("s", "");
    } else {
      return null;
    }
  })();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    setShrinkNavbar("true");
    setVisible(false);
    setFooterVisible(false);

    return () => {
      document.documentElement.style.overflow = "visible";
      setShrinkNavbar("false");
      setFooterVisible(true);
      setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      origin: "https://aiofeed.com/youtube",
      start: startTime || 0,
      frameborder: "0",
      fs: 1,
    },
  };

  return (
    <>
      <PlayerNavbar visible={visible} />
      <VideoAndChatContainer
        style={{
          height: visible ? "calc(100vh - 85px)" : "100vh",
          top: visible ? "85px" : "0",
          display: "unset",
        }}>
        <ShowNavbarBtn
          variant='dark'
          onClick={() => {
            setVisible(!visible);
          }}
          style={{ right: "0" }}>
          <MdVerticalAlignBottom
            style={{
              transform: visible ? "rotateX(180deg)" : "unset",
              right: "10px",
            }}
            size={30}
            title='Show navbar'
          />
          Navbar
        </ShowNavbarBtn>
        <StyledYoutubeIframe
          videoId={videoId}
          opts={opts}
          id={videoId + "player"}
          containerClassName='IframeContainer'
        />
      </VideoAndChatContainer>
    </>
  );
};
