import React, { useContext } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FeedsContext, { FeedsProvider } from '../feed/FeedsContext';
import { NavigationProvider } from '../navigation/NavigationContext';
import { NotificationsProvider } from '../notifications/NotificationsContext';
import { ThemeProvider } from '../../components/themes/ThemeContext';
import { FooterProvider } from '../footer/FooterContext';
import { AccountProvider } from '../account/AccountContext';
import CookieConsentAlert from './CookieConsentAlert';
import Routes from '../routes';
import ThemeContext from './../../components/themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { TwitchContext, TwitchProvider } from '../twitch/useToken';
import { YoutubeContext, YoutubeProvider } from '../youtube/useToken';
import { VodsProvider } from '../twitch/vods/VodsContext';
import { MyListsProvider } from '../myLists/MyListsContext';
import { LogsProvider } from '../logs/LogsContext';
import { FeedSectionsProvider } from '../feedSections/FeedSectionsContext';
import { TwitterProvider } from '../twitter/TwitterContext';
import CleanUp from './CleanUp';

const AppContainer = styled.div`
  background-image: ${({ image }) => `url(/images/${image})`};
  background-color: var(--backgroundColor);
  object-fit: cover;
  background-position-x: center;
  background-position-y: var(--backgroundImgPositionY);
  background-size: var(--backgroundImgSize);
  background-repeat: var(--backgroundImgRepeat);
  background-attachment: fixed;

  scrollbar-color: var(--scrollbarColors) !important;
  scrollbar-width: thin !important;

  /* body.modal-open & {
    background-position-x: -8px;
  } */
`;

const AppRoutesContainer = () => {
  return (
    <React.StrictMode>
      <LogsProvider>
        <ThemeProvider>
          <AccountProvider>
            <TwitchProvider>
              <YoutubeProvider>
                <NavigationProvider>
                  <NotificationsProvider>
                    <TwitterProvider>
                      <FeedsProvider>
                        <FeedSectionsProvider>
                          <MyListsProvider>
                            <VodsProvider>
                              <FooterProvider>
                                <App />
                              </FooterProvider>
                            </VodsProvider>
                          </MyListsProvider>
                        </FeedSectionsProvider>
                      </FeedsProvider>
                    </TwitterProvider>
                  </NotificationsProvider>
                </NavigationProvider>
              </YoutubeProvider>
            </TwitchProvider>
          </AccountProvider>
        </ThemeProvider>
      </LogsProvider>
    </React.StrictMode>
  );
};

const App = () => {
  const { activeTheme } = useContext(ThemeContext);
  const { setEnableTwitch, setEnableYoutube } = useContext(FeedsContext);
  const {
    setTwitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage,
  } = useContext(TwitchContext);
  const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } =
    useContext(YoutubeContext);

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  function receiveMessage(e) {
    if (e.origin.startsWith('https://aiofeed.com') && e.data?.token && e.data?.service) {
      if (e.data.service === 'twitch') {
        if (setTwitchAccessToken) setTwitchAccessToken(e.data.token);
        if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
        if (setTwitchUsername) setTwitchUsername(e.data.username);
        if (setTwitchUserId) setTwitchUserId(e.data.userId);
        if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);

        setEnableTwitch(true);
      } else if (e.data.service === 'youtube') {
        if (e.data.token && setYoutubeAccessToken) setYoutubeAccessToken(e.data.token);
        if (e.data.username && setYoutubeUsername) setYoutubeUsername(e.data.username);
        if (e.data.profileImg && setYoutubeProfileImage) setYoutubeProfileImage(e.data.profileImg);
        if (setEnableYoutube) setEnableYoutube(true);
      }
    }
  }

  return (
    <AppContainer id='AppContainer' image={activeTheme.image}>
      <CleanUp />
      <Routes />
      <CookieConsentAlert />
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </AppContainer>
  );
};

export default AppRoutesContainer;
