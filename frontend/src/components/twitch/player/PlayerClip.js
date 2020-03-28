import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { MdVerticalAlignBottom } from "react-icons/md";
import { useParams, useLocation } from "react-router-dom";
import React, { useContext, useEffect } from "react";

import NavigationContext from "./../../navigation/NavigationContext";
import { VideoAndChatContainer, StyledVideo, PlayerNavbar } from "./StyledComponents";

export default () => {
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { id } = useParams();
  const location = useLocation();
  const nameFromHash = location.hash !== "" && location.hash.replace("#", "");
  document.title = `${nameFromHash} | Clips`;

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
          {nameFromHash && (
            <Link to={`/channel/${nameFromHash}`}>
              <MdAccountCircle size={20} />
              {nameFromHash}'s channel page
            </Link>
          )}
        </PlayerNavbar>
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        style={{
          height: visible ? "calc(100vh - 75px)" : "100vh",
          top: visible ? "75px" : "0",
          display: "unset",
        }}>
        <MdVerticalAlignBottom
          style={{
            transform: visible ? "rotateX(180deg)" : "unset",
            right: "10px",
          }}
          size={45}
          id='ToggleNavbarButton'
          title='Show navbar'
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
          preload='auto'
        />
      </VideoAndChatContainer>
    </>
  );
};
