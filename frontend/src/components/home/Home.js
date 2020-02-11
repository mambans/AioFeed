import React, { useContext, useEffect, useRef } from "react";

import "./Home.scss";
import { BlurOverlay, TopBlurOverlay, LogoText, WelcomeContainer } from "./HomeStyledComponents";
import NavigationContext from "./../navigation/NavigationContext";

const INACTIVE_TIMER = 120; // seconds

export default () => {
  document.title = "Notifies";
  const { setVisible, visible } = useContext(NavigationContext);
  const inactiveTimer = useRef();
  const topNavbarBlur = useRef();

  const Logos = () => {
    return (
      <>
        {visible ? null : (
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
              src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`}
              alt='logo'
              id='logo'
            />
            <div>
              <h1>
                <b>otifies</b>
              </h1>
              <p>View Twitch & Youtube feeds and get notified about Twitch Livestreams.</p>
            </div>
          </LogoText>
        </WelcomeContainer>
      </>
    );
  };

  useEffect(() => {
    setVisible(false);
    document.documentElement.setAttribute("homepage", "true");
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.removeAttribute("homepage");
    };
  }, [setVisible]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setVisible(true);
    });

    window.addEventListener("wheel", () => {
      setVisible(true);
    });

    if (!inactiveTimer.current) {
      inactiveTimer.current = setInterval(() => {
        setVisible(false);
      }, 1000 * INACTIVE_TIMER);
    }

    return () => {
      window.removeEventListener("scroll", () => {
        setVisible(true);
      });
      window.removeEventListener("wheel", () => {
        setVisible(true);
      });
      clearInterval(inactiveTimer.current);
    };
  }, [setVisible]);

  return <Logos></Logos>;
};
