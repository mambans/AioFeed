import React, { useEffect } from 'react';

import './Home.scss';
import { BlurOverlay, LogoText, WelcomeContainer } from './StyledComponents';

export default () => {
  document.title = 'AioFeed';

  const Logos = () => {
    return (
      <>
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
