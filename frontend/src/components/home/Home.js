import React, { useContext, useEffect, useRef } from "react";

import "./Home.scss";
import { BlurOverlay, TopBlurOverlay, LogoText } from "./HomeStyledComponents";
import NavigationContext from "./../navigation/NavigationContext";
import styles from "./Home.module.scss";

const INACTIVE_TIMER = 60; // seconds
const NAV_OPEN_DELAY_TIMER = 2; // seconds

const Home = () => {
  const { setVisible } = useContext(NavigationContext);
  const inactiveTimer = useRef();
  const topNavbarBlur = useRef();
  const topNavbarDelay = useRef();

  useEffect(() => {
    setVisible(false);
    document.documentElement.setAttribute("homepage", "true");

    topNavbarDelay.current = setTimeout(() => {
      setVisible(true);
    }, 1000 * NAV_OPEN_DELAY_TIMER);

    return () => {
      clearTimeout(topNavbarDelay.current);
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

  const Logos = () => {
    return (
      <>
        <TopBlurOverlay
          ref={topNavbarBlur}
          onMouseEnter={() => {
            console.log("mouseenter ");
            setVisible(true);
          }}
          onMouseLeave={() => {
            console.log("mouseenter");
            setVisible(false);
          }}
        />
        <BlurOverlay />
        <div className={styles.container}>
          <LogoText>
            <img
              src={`${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`}
              alt='logo'
              className={styles.logo}
            />
            <div>
              <h1>
                <b>otifies</b>
              </h1>
              <p>View Twitch & Youtube feeds and get notified about Twitch Livestreams.</p>
            </div>
          </LogoText>
        </div>
        {/* <div className={styles.container}>
          <LogoText>
            <img
              src={`${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`}
              alt='logo'
              className={styles.logo}
            />
            <h1>
              <b>otifies</b>
            </h1>
          </LogoText>
          <div className={styles.deviderLine}></div>

          <p>A site/app for viewing feeds and updates from Youtube and Twitch.</p>
        </div> */}

        {/* <div className={styles.container}>
          <img
            src={`${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`}
            alt='logo'
            className={styles.logo}
          />
          <div className={styles.deviderLine}></div>
          <h1>
            <b>Notifies</b>
          </h1>
          <p>A site/app for viewing feeds and updates from Youtube and Twitch.</p>
        </div> */}
      </>
    );
  };
  return <Logos></Logos>;
};

export default Home;
