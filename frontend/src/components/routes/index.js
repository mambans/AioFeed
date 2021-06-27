import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Feed from '../feed';
import Footer from '../footer';
import Home from '../home';
import Legality from '../legality';
import Navigation from '../navigation';
import TopStreams from '../twitch/categoryTopStreams';
import TwitchAuthCallback from '../auth/TwitchAuthCallback';
import TwitchChannelRoutes from '../twitch/Routes';
import YoutubeAuthCallback from '../auth/YoutubeAuthCallback';
import Twitch from '../twitch/live';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import Youtube from '../youtube';
import Favorites from '../favorites';
import SharedVideoPlayer from '../sharedComponents/SharedVideoPlayer';

const MainContentContainer = styled.main`
  min-height: 100vh;
  padding-top: 70px;
`;

const NavigationRoutes = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <MainContentContainer>
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='index' element={<Home />} />
          <Route path='home' element={<Home />} />

          <Route path='legality' element={<Legality />} />
          <Route path='privacy' element={<Legality />} />

          <Route path='vods' element={<TwitchVods />} />
          <Route path='feed' element={<Feed />} />
          <Route path='live' element={<Twitch forceMountTwitch={true} />} />
          <Route path='favorites' element={<Favorites />} />

          <Navigate path='saved' to='favorites' />
          <Navigate path='lists' to='favorites' />
          <Navigate path='twitch' to='live' />
          <Route path='twitter' element={<Twitter />} />

          <Route path='youtube' element={<Youtube />} />
          <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
          <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
          <Route path='youtube/:videoId' element={<SharedVideoPlayer />} />

          <Route path='category' element={<TopStreams />} />
          <Navigate path='game' to='/category' />
          <Navigate path='top' to='/category' />
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
