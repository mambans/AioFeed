import React, { useContext, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import AccountContext from "./../../account/AccountContext";
import CreateAccount from "./CreateAccount";
import Login from "./Login";
import NavigationContext from "./../NavigationContext";
import SidebarAccount from "./SidebarAccount";
import { StyledNavSidebarTrigger, StyledLoginButton } from "./../StyledComponents";
import {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledSidebarTrigger,
} from "./StyledComponent";

export default () => {
  const {
    profileImage,
    username,
    setTwitchToken,
    setYoutubeToken,
    setRefreshToken,
    setYoutubeUsername,
    setYoutubeProfileImg,
    setTwitchUsername,
    setTwitchProfileImg,
  } = useContext(AccountContext);
  const { setRenderModal, renderModal, showSidebar, setShowSidebar } = useContext(
    NavigationContext
  );

  const handleToggle = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    function receiveMessage(event) {
      if (
        event.origin === "https://aiofeed.com" &&
        typeof event.data === "object" &&
        event.data.token &&
        event.data.service
      ) {
        if (event.data.service === "twitch") {
          setTwitchToken(event.data.token);
          setRefreshToken(event.data.refresh_token);
          setTwitchUsername(event.data.username);
          setTwitchProfileImg(event.data.profileImg);
        } else if (event.data.service === "youtube") {
          setYoutubeToken(event.data.token);
          setYoutubeUsername(event.data.username);
          setYoutubeProfileImg(event.data.profileImg);
        }
      }
    }

    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage, false);
    };
  }, [
    setTwitchToken,
    setYoutubeToken,
    setRefreshToken,
    setTwitchUsername,
    setTwitchProfileImg,
    setYoutubeUsername,
    setYoutubeProfileImg,
  ]);

  return (
    <>
      <StyledNavSidebarTrigger onClick={handleToggle} title='Sidebar'>
        {username ? (
          <>
            <StyledSidebarTrigger id='NavigationProfileImageHoverOverlay' open={showSidebar} />
            <img
              id='NavigationProfileImage'
              src={
                profileImage !== null
                  ? profileImage
                  : `${process.env.PUBLIC_URL}/images/placeholder.jpg`
              }
              alt=''
            />
          </>
        ) : (
          <StyledLoginButton>Login</StyledLoginButton>
        )}
      </StyledNavSidebarTrigger>

      <CSSTransition
        in={showSidebar}
        timeout={500}
        classNames='NavSidebarBackdropFade'
        unmountOnExit>
        <StyledNavSidebarBackdrop
          onClick={() => {
            setShowSidebar(false);
          }}
        />
      </CSSTransition>

      <CSSTransition
        in={showSidebar}
        timeout={1000}
        classNames='NavSidebarSlideRight'
        unmountOnExit>
        <StyledNavSidebar>
          {username ? (
            <SidebarAccount setRenderModal={setRenderModal} />
          ) : renderModal === "create" ? (
            <CreateAccount />
          ) : (
            <Login />
          )}
        </StyledNavSidebar>
      </CSSTransition>
    </>
  );
};
