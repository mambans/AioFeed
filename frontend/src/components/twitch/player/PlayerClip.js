import { CSSTransition } from "react-transition-group";
import { ic_account_circle } from "react-icons-kit/md/ic_account_circle";
import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import Icon from "react-icons-kit";
import React, { useContext, useEffect } from "react";

import NavigationContext from "./../../navigation/NavigationContext";
import {
  VideoAndChatContainer,
  StyledVideo,
  ToggleNavbarButton,
  PlayerNavbar,
} from "./StyledComponents";

export default () => {
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { id } = useParams();
  const location = useLocation();
  const nameFromHash = location.hash !== "" ? location.hash.replace("#", "") : null;
  document.title = `${nameFromHash} | Clips`;

  useEffect(() => {
    setShrinkNavbar("true");
    setFooterVisible(false);

    return () => {
      setShrinkNavbar("false");
      setFooterVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible]);

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar>
          {nameFromHash ? (
            <Link to={`/twitch/channel/${nameFromHash}`}>
              <div id='icon'>
                <Icon icon={ic_account_circle} size={20}></Icon>
              </div>
              {nameFromHash}'s channel page
            </Link>
          ) : null}
        </PlayerNavbar>
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        style={{
          height: visible ? "calc(100vh - 75px)" : "100vh",
          top: visible ? "75px" : "0",
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
    </>
  );
};
