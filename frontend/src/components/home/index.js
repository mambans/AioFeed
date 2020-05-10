import React, { useContext, useEffect, useRef, useCallback } from "react";

import "./Home.scss";
import { BlurOverlay, TopBlurOverlay, LogoText, WelcomeContainer } from "./StyledComponents";
import NavigationContext from "./../navigation/NavigationContext";

const INACTIVE_TIMER = 120; // seconds

export default () => {
  document.title = "AioFeed";
  const { setVisible, visible } = useContext(NavigationContext);
  const inactiveTimer = useRef();
  const topNavbarBlur = useRef();

  const Logos = () => {
    return (
      <>
        {!visible && (
          <TopBlurOverlay
            ref={topNavbarBlur}
            onMouseEnter={() => {
              setVisible(true);
            }}
            onMouseLeave={() => {
              setVisible(false);
            }}
          />
        )}
        <BlurOverlay />
        <WelcomeContainer>
          <LogoText>
            <img
              src={`${process.env.PUBLIC_URL}/A/android-chrome-512x512.png`}
              alt='logo'
              id='logo'
            />
            <div>
              <h1>
                <b>ioFeed</b>
              </h1>
              <p>
                View Twitch & Youtube feeds and Twitter list in one page, with Twitch
                (live/offline/update) notifications.
              </p>
            </div>
          </LogoText>
        </WelcomeContainer>
      </>
    );
  };

  const setVisibleNavbar = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  useEffect(() => {
    setVisible(false);
    window.addEventListener("scroll", setVisibleNavbar);
    window.addEventListener("wheel", setVisibleNavbar);
    document.documentElement.setAttribute("homepage", "true");
    window.scrollTo(0, 0);

    if (!inactiveTimer.current) {
      inactiveTimer.current = setInterval(() => {
        setVisible(false);
      }, 1000 * INACTIVE_TIMER);
    }

    return () => {
      window.removeEventListener("scroll", setVisibleNavbar);
      window.removeEventListener("wheel", setVisibleNavbar);
      document.documentElement.removeAttribute("homepage");
      clearInterval(inactiveTimer.current);
      setVisible(true);
    };
  }, [setVisible, setVisibleNavbar]);

  return <Logos></Logos>;
};
