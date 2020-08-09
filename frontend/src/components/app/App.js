import React, { useEffect, useContext } from 'react';

import { FeedsProvider } from '../feed/FeedsContext';
import { NavigationProvider } from '../navigation/NavigationContext';
import { NotificationsProvider } from '../notifications/NotificationsContext';
import { ThemeProvider } from '../themes/ThemeContext';
import AccountContext, { AccountProvider } from '../account/AccountContext';
import CookieConsentAlert from '../CookieConsentAlert';
import Routes from './../routes';
import SetStartupTheme from '../themes';
import ThemeContext from './../themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';

export default () => {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AccountProvider>
          <NotificationsProvider>
            <FeedsProvider>
              <App />
            </FeedsProvider>
          </NotificationsProvider>
        </AccountProvider>
      </NavigationProvider>
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

  useEffect(() => {
    SetStartupTheme(themesArray);
  }, [themesArray]);

  function receiveMessage(event) {
    if (
      event.origin.startsWith('https://aiofeed.com') &&
      typeof event.data === 'object' &&
      event.data.token &&
      event.data.service
    ) {
      if (event.data.service === 'twitch') {
        setTwitchToken(event.data.token);
        setRefreshToken(event.data.refresh_token);
        setTwitchUsername(event.data.username);
        setTwitchProfileImg(event.data.profileImg);
      } else if (event.data.service === 'youtube') {
        if (event.data.token) setYoutubeToken(event.data.token);
        if (event.data.username) setYoutubeUsername(event.data.username);
        if (event.data.profileImg) setYoutubeProfileImg(event.data.profileImg);
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
