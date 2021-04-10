import React, { useEffect, useContext } from 'react';

import { FeedsProvider } from '../feed/FeedsContext';
import { NavigationProvider } from '../navigation/NavigationContext';
import { NotificationsProvider } from '../notifications/NotificationsContext';
import { ThemeProvider } from '../themes/ThemeContext';
import { FooterProvider } from '../footer/FooterContext';
import AccountContext, { AccountProvider } from '../account/AccountContext';
import CookieConsentAlert from './CookieConsentAlert';
import Routes from '../routes';
import SetStartupTheme from '../themes';
import ThemeContext from './../themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { TwitchProvider } from '../twitch/useToken';
import { YoutubeProvider } from '../youtube/useToken';

export default () => {
  return (
    <ThemeProvider>
      <AccountProvider>
        <TwitchProvider>
          <YoutubeProvider>
            <NavigationProvider>
              <NotificationsProvider>
                <FeedsProvider>
                  <FooterProvider>
                    <App />
                  </FooterProvider>
                </FeedsProvider>
              </NotificationsProvider>
            </NavigationProvider>
          </YoutubeProvider>
        </TwitchProvider>
      </AccountProvider>
    </ThemeProvider>
  );
};

const App = () => {
  const { themesArray } = useContext(ThemeContext);
  const {
    setTwitchToken,
    setYoutubeToken,
    setRefreshToken,
    setYoutubeUsername,
    setYoutubeProfileImg,
    setTwitchUsername,
    setTwitchProfileImg,
  } = useContext(AccountContext);

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  useEffect(() => SetStartupTheme(themesArray), [themesArray]);

  function receiveMessage(e) {
    if (e.origin.startsWith('https://aiofeed.com') && e.data?.token && e.data?.service) {
      if (e.data.service === 'twitch') {
        setTwitchToken(e.data.token);
        setRefreshToken(e.data.refresh_token);
        setTwitchUsername(e.data.username);
        setTwitchProfileImg(e.data.profileImg);
      } else if (e.data.service === 'youtube') {
        if (e.data.token) setYoutubeToken(e.data.token);
        if (e.data.username) setYoutubeUsername(e.data.username);
        if (e.data.profileImg) setYoutubeProfileImg(e.data.profileImg);
      }
    }
  }

  return (
    <>
      <Routes />
      <CookieConsentAlert />
    </>
  );
};
