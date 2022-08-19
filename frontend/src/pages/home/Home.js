import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Alert from '../../components/alert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { navigationSidebarAtom } from '../navigation/atoms';
import ThemeContext from './../../components/themes/ThemeContext';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

export const Home = () => {
  useDocumentTitle();
  const { activeTheme } = useContext(ThemeContext);
  const showLoginAlert = useLocation()?.state?.showLoginAlert;
  const showNavigationSidebar = useSetRecoilState(navigationSidebarAtom);

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

  useEffect(() => {
    if (showLoginAlert) {
      showNavigationSidebar(true);
    }
  }, [showLoginAlert, showNavigationSidebar]);

  if (showLoginAlert) {
    return (
      <Alert
        type='info'
        title='Login to continue'
        message='Login with your AioFeed account'
        onClick={() => showNavigationSidebar((c) => !c)}
      />
    );
  }
  return <Logos></Logos>;
};
