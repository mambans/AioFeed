import React from 'react';
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

const MainContentContainer = styled.main`
  min-height: 100vh;
  padding-top: 95px;
`;

const NavigationRoutes = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <MainContentContainer id='MainContentContainer' tabIndex={0}>
        <Routes>
          <Route index element={<Home />} />
          {/* <Route path='' element={<Home />} /> */}
          <Route path='index' element={<Home />} />
          <Route path='home' element={<Home />} />

          <Route path='legality' element={<Legality />} />
          <Route path='privacy' element={<Legality />} />

          <Route path='vods' element={<TwitchVods />} />
          <Route path='feed' element={<Feed />} />
          <Route path='live' element={<TwitchStandalone forceMount={true} />} />
          {/* <Navigate path='favorites' to='mylists' />
          <Navigate path='customlists' to='mylists' />
          <Navigate path='lists' to='mylists' />
          <Navigate path='saved' to='mylists' /> */}
          <Route path='mylists' element={<MyLists />} />
          <Route path='favorites' element={<Navigate to={'../mylists'} replace />} />
          <Route path='customlists' element={<Navigate to={'../mylists'} replace />} />
          <Route path='lists' element={<Navigate to={'../mylists'} replace />} />
          <Route path='saved' element={<Navigate to={'../mylists'} replace />} />

          {/* <Navigate path='twitch' to='live' /> */}
          <Route path='twitch' element={<Navigate to={'../live'} replace />} />

          <Route path='twitter' element={<Twitter />} />

          <Route path='youtube' element={<Youtube />} />
          <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
          <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
          <Route path='youtube/:videoId' element={<SharedVideoPlayer />} />

          <Route path='category' element={<TopStreams />} />
          {/* <Navigate path='game' to='/category' />
          <Navigate path='top' to='/category' /> */}

          <Route path='game' element={<Navigate to={'../category'} replace />} />
          <Route path='top' element={<Navigate to={'../category'} replace />} />

          <Route path='category/:category' element={<TopStreams />} />
          <Route path='game/:category' element={<TopStreams />} />
          <Route path='top/:category' element={<TopStreams />} />
          <Route path='videos/:videoId' element={<SharedVideoPlayer />} />
          <Route path=':channelName/*' element={<TwitchChannelRoutes />} />
        </Routes>
      </MainContentContainer>
      <Footer />
    </BrowserRouter>
  );
};

export default NavigationRoutes;
