import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { MdVerticalAlignBottom } from "react-icons/md";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect } from "react";

import NavigationContext from "./../../navigation/NavigationContext";
import {
  VideoAndChatContainer,
  StyledVideo,
  PlayerNavbar,
  ShowNavbarBtn,
} from "./StyledComponents";

export default () => {
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { videoId, channelName } = useParams();
  document.title = `${channelName} | Clip -${videoId}`;

  useEffect(() => {
    setShrinkNavbar("true");
    setFooterVisible(false);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "visible";
      setShrinkNavbar("false");
      setFooterVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible]);

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar>
          {channelName && (
            <Link to={`/${channelName}/channel`}>
              <MdAccountCircle size={20} />
              {channelName}'s channel page
            </Link>
          )}
        </PlayerNavbar>
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        style={{
          height: visible ? "calc(100vh - 85px)" : "100vh",
          top: visible ? "85px" : "0",
          display: "unset",
        }}>
        <ShowNavbarBtn
          variant='dark'
          onClick={() => {
            setVisible(!visible);
          }}>
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
        <StyledVideo
          src={`https://clips.twitch.tv/embed?clip=${videoId}`}
          height='100%'
          width='100%'
          frameborder='0'
          allowfullscreen='true'
          scrolling='no'
          preload='auto'
        />
      </VideoAndChatContainer>
    </>
  );
};
