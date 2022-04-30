import React, { useContext, useEffect } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ThemeContext from './../../components/themes/ThemeContext';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

export const Home = () => {
  console.log('Home:');
  useDocumentTitle();
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
              View Twitch & YouTube feeds and Twitter list in one page, with Twitch
              (live/offline/update) notifications.
            </p>
            <p>Custom lists with Twitch/YouTube videos.</p>
            <p>Group Twitch live streams by title/category/channel etc.. </p>
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
