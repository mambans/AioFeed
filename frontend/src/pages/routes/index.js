import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Feed from '../feed';
import Footer from '../footer';
import { Home } from '../home';
import Legality from '../legality';
import Navigation from '../navigation';
import TopStreams from '../twitch/categoryTopStreams';
import TwitchAuthCallback from '../auth/TwitchAuthCallback';
import TwitchChannelRoutes from '../twitch/Routes';
import YoutubeAuthCallback from '../auth/YoutubeAuthCallback';
import { TwitchStandalone } from '../twitch/live';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import Youtube from '../youtube';
import MyLists from '../myLists';
import SharedVideoPlayer from '../sharedComponents/SharedVideoPlayer';
import VerifyEmail from '../account/VerifyEmail';
import AccountContext from '../account/AccountContext';
import Player from '../twitch/player/Player';
import StandaloneChat from '../twitch/player/StandaloneChat';
import LoadingIndicator from '../../components/LoadingIndicator';
import ChannelSearchBar from '../twitch/searchbars/ChannelSearchBar';
import { msToHMS } from '../../util';

const MainContentContainer = styled.main`
  min-height: 100vh;
  padding-top: 95px;
`;

const routes = [
  {
    path: 'index',
    element: <Home />,
  },
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'legality',
    element: <Legality />,
  },
  {
    path: 'privacy',
    element: <Legality />,
  },
  {
    path: 'verify-email',
    element: <VerifyEmail />,
  },

  {
    path: 'vods',
    element: <TwitchVods />,
    authRequired: true,
  },
  {
    path: 'feed',
    element: <Feed />,
    authRequired: true,
  },
  {
    path: 'live',
    element: <TwitchStandalone forceMount={true} />,
    authRequired: true,
  },
  {
    path: 'mylists',
    element: <MyLists />,
    authRequired: true,
  },
  {
    path: 'favorites',
    element: <Navigate to={'../mylists'} replace />,
  },
  {
    path: 'customlists',
    element: <Navigate to={'../mylists'} replace />,
  },
  {
    path: 'lists',
    element: <Navigate to={'../mylists'} replace />,
  },
  {
    path: 'saved',
    element: <Navigate to={'../mylists'} replace />,
  },
  {
    path: 'twitch',
    element: <Navigate to={'../live'} replace />,
  },
  {
    path: 'twitter',
    element: <Twitter />,
    authRequired: true,
  },
  {
    path: 'youtube',
    element: <Youtube />,
    authRequired: true,
  },
  {
    path: 'auth/twitch/callback',
    element: <TwitchAuthCallback />,
  },
  {
    path: 'auth/youtube/callback',
    element: <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />,
  },
  {
    path: 'youtube/:videoId',
    element: <SharedVideoPlayer />,
    authRequired: true,
  },
  {
    path: 'category',
    element: <TopStreams />,
    authRequired: true,
  },
  {
    path: 'game',
    element: <Navigate to={'../category'} replace />,
  },
  {
    path: 'category/:category',
    element: <TopStreams />,
  },
  {
    path: 'game/:category',
    element: <TopStreams />,
    authRequired: true,
  },
  {
    path: 'top/:category',
    element: <TopStreams />,
    authRequired: true,
  },
  {
    path: 'videos/:videoId',
    element: <SharedVideoPlayer />,
    authRequired: true,
  },
  {
    path: 'search',
    element: (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {msToHMS(3660000)}
        <ChannelSearchBar />
      </div>
    ),
  },
  {
    path: ':channelName',
    element: <Player />,
  },
  {
    path: ':channelName/chat',
    element: <StandaloneChat />,
  },
  {
    path: ':channelName/*',
    element: <TwitchChannelRoutes />,
    authRequired: true,
  },
];

const NavigationRoutes = () => {
  const { user, loading } = useContext(AccountContext);

  return (
    <BrowserRouter>
      <Navigation />
      <MainContentContainer id='MainContentContainer' tabIndex={0}>
        <Routes>
          {routes.map(({ element, authRequired, ...rest }, key) => {
            return (
              <Route
                {...rest}
                key={key}
                element={
                  authRequired ? (
                    loading ? (
                      <LoadingIndicator height={400} width={600} text={'Authenticating..'} />
                    ) : !user ? (
                      <Navigate to='/' state={{ showLoginAlert: true }} replace />
                    ) : (
                      element
                    )
                  ) : (
                    element
                  )
                }
              />
            );
          })}
        </Routes>
      </MainContentContainer>
      <Footer />
    </BrowserRouter>
  );
};

export default NavigationRoutes;
