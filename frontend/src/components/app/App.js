import React, { useContext } from 'react';
import styled from 'styled-components';

import FeedsContext, { FeedsProvider } from '../feed/FeedsContext';
import { NavigationProvider } from '../navigation/NavigationContext';
import { NotificationsProvider } from '../notifications/NotificationsContext';
import { ThemeProvider } from '../themes/ThemeContext';
import { FooterProvider } from '../footer/FooterContext';
import AccountContext, { AccountProvider } from '../account/AccountContext';
import CookieConsentAlert from './CookieConsentAlert';
import Routes from '../routes';
import ThemeContext from './../themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { TwitchProvider } from '../twitch/useToken';
import { YoutubeProvider } from '../youtube/useToken';
import { VodsProvider } from '../twitch/vods/VodsContext';

const AppContainer = styled.div`
  background-image: ${({ image }) => `url(/images/${image})`};
  background-color: var(--backgroundColor);
  object-fit: cover;
  background-position-x: center;
  background-position-y: center;
  background-size: var(--backgroundImgSize);
  background-repeat: var(--backgroundImgRepeat);
  background-attachment: fixed;

  scrollbar-color: var(--scrollbarColors) !important;
  scrollbar-width: thin !important;
`;

const AppRoutesContainer = () => {
  return (
    <ThemeProvider>
      <AccountProvider>
        <TwitchProvider>
          <YoutubeProvider>
            <NavigationProvider>
              <NotificationsProvider>
                <FeedsProvider>
                  <VodsProvider>
                    <FooterProvider>
                      <App />
                    </FooterProvider>
                  </VodsProvider>
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
  const { activeTheme } = useContext(ThemeContext);
  const {
    setTwitchToken,
    setYoutubeToken,
    setRefreshToken,
    setYoutubeUsername,
    setYoutubeProfileImg,
    setTwitchUsername,
    setTwitchProfileImg,
  } = useContext(AccountContext);
  const { setEnableTwitch, setEnableYoutube } = useContext(FeedsContext);

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  function receiveMessage(e) {
    if (e.origin.startsWith('https://aiofeed.com') && e.data?.token && e.data?.service) {
      if (e.data.service === 'twitch') {
        setTwitchToken(e.data.token);
        setRefreshToken(e.data.refresh_token);
        setTwitchUsername(e.data.username);
        setTwitchProfileImg(e.data.profileImg);
        setEnableTwitch(true);
      } else if (e.data.service === 'youtube') {
        if (e.data.token) setYoutubeToken(e.data.token);
        if (e.data.username) setYoutubeUsername(e.data.username);
        if (e.data.profileImg) setYoutubeProfileImg(e.data.profileImg);
        setEnableYoutube(true);
      }
    }
  }

  return (
    <AppContainer id='AppContainer' image={activeTheme.image}>
      <Routes />
      <CookieConsentAlert />
    </AppContainer>
  );
};

export default AppRoutesContainer;
