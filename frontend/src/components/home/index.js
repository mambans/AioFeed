import React, { useContext, useEffect } from 'react';
import ThemeContext from './../themes/ThemeContext';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

const Home = () => {
  document.title = 'AioFeed';
  const { activeTheme } = useContext(ThemeContext);

  const Logos = () => (
    <>
      <BlurOverlay image={activeTheme.image} />
      <WelcomeContainer>
        <LogoText>
          <img
            rel='preload'
            src={`${process.env.PUBLIC_URL}/android-chrome-512x512.webp`}
            alt='logo'
            id='logo'
          />
          <div>
            <h1>
              <b>AioFeed</b>
            </h1>
            <DevideLine />
            <p>
              View Twitch & Youtube feeds and a Twitter list in one page, with Twitch
              (live/offline/update) notifications.
            </p>
          </div>
        </LogoText>
      </WelcomeContainer>
    </>
  );

  useEffect(() => {
    document.documentElement.setAttribute('homepage', 'true');
    window.scrollTo(0, 0);

    return () => document.documentElement.removeAttribute('homepage');
  }, []);

  return <Logos></Logos>;
};

export default Home;
