import React, { useEffect } from 'react';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer, DevideLine } from './StyledComponents';

export default () => {
  document.title = 'AioFeed';

  const Logos = () => {
    return (
      <>
        <BlurOverlay />
        <WelcomeContainer>
          <LogoText>
            <img
              // src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`}
              src={`${process.env.PUBLIC_URL}/logo_transparent.png`}
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
  };

  useEffect(() => {
    document.documentElement.setAttribute('homepage', 'true');
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.removeAttribute('homepage');
    };
  }, []);

  return <Logos></Logos>;
};
