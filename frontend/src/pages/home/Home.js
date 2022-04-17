import React, { useContext, useEffect } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { AddCookie } from '../../util';
import ThemeContext from './../../components/themes/ThemeContext';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

export const Home = () => {
  console.log('Home:');
  useDocumentTitle();
  const { activeTheme } = useContext(ThemeContext);

  AddCookie('Twitch-access_token', 'tbgvfv73ybtw567mzg7vtwn4dq03xr');
  AddCookie('Twitch-app_token', '3wt7dy67uadta1nzwros6wuql8r7lp');
  AddCookie(
    'Twitch-profileImg',
    'https://static-cdn.jtvnw.net/jtv_user_pictures/243cf701-813d-41d1-bb3c-b1fcc5757376-profile_image-300x300.png'
  );
  AddCookie('Twitch-refresh_token', 'nc149mlwlo2qhk8qu7o8vzp3uqz5x4g0n6wsp5v8it0xc6r68n');
  AddCookie('Twitch-userId', '32540540');
  AddCookie('Twitch-username', 'Mambans');

  AddCookie('AioFeed_AccountName', 'mambans');
  AddCookie('AioFeed_AuthKey', 'U2FsdGVkX1/GxC6CkDjfqizynCMNGswEOGlODe4ZYredgFBtlaZhGz1rsiTE4asa');

  useEffect(() => {}, []);

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
