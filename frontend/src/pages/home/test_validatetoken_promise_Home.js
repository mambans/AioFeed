import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Alert from '../../components/alert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import AccountContext from '../account/AccountContext';
import { navigationSidebarComponentKeyAtom } from '../navigation/atoms';
import validateToken from '../twitch/validateToken';
import ThemeContext from './../../components/themes/ThemeContext';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

export const Home = () => {
  useDocumentTitle();
  const { activeTheme } = useContext(ThemeContext);
  const { user } = useContext(AccountContext);
  const showLoginAlert = useLocation()?.state?.showLoginAlert;
  const setNavigationSidebarComponentKey = useSetRecoilState(navigationSidebarComponentKeyAtom);

  useEffect(() => {
    (async () => {
      const getToken = async () => {
        const home = await validateToken();
        console.log('home:', home);
      };

      Promise.all([validateToken(), validateToken(), validateToken()]).then((r) => {
        console.log('r:', r);
      });

      const home = await validateToken();
      console.log('home:', home);
      const home1 = await validateToken();
      console.log('home1:', home1);
      const home2 = await validateToken();
      console.log('home2:', home2);
      const home3 = await validateToken();
      console.log('home3:', home3);
      const home4 = await validateToken();
      console.log('home4:', home4);
      const home5 = await validateToken();
      console.log('home5:', home5);
      const home6 = await validateToken();
      console.log('home6:', home6);

      setTimeout(getToken, 1000);
      setTimeout(getToken, 1000);
      setTimeout(getToken, 1000);

      setTimeout(getToken, 2000);
    })();
  }, []);

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
      setNavigationSidebarComponentKey({ comp: 'signin' });
    }
  }, [showLoginAlert, setNavigationSidebarComponentKey]);

  if (showLoginAlert && !user) {
    return (
      <Alert
        type='info'
        title='Login to continue'
        message='Login with your AioFeed account'
        onClick={() => setNavigationSidebarComponentKey({ comp: 'signin' })}
      />
    );
  }
  return <Logos></Logos>;
};
