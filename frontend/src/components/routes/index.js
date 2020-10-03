import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Feed from '../feed';
import Footer from '../footer';
import Home from '../home';
import Legality from '../legality';
import Navbar from '../navigation';
import VideoPlayer from './../twitch/player/VideoPlayer';
import TopStreams from '../twitch/categoryTopStreams';
import TwitchAuth from '../auth/TwitchAuth';
import TwitchAuthCallback from '../auth/TwitchAuthCallback';
import TwitchChannelRoutes from './../twitch/Routes';
import YoutubeAuth from '../auth/YoutubeAuth';
import YoutubeAuthCallback from '../auth/YoutubeAuthCallback';
import YoutubeVideoPlayer from './../youtube/YoutubeVideoPlayer';
import { VodsProvider } from './../twitch/vods/VodsContext';
import Twitch from '../twitch/live';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import Youtube from './../youtube';
import Favorites from '../favorites';
import { FavoritesProvider } from '../favorites/FavoritesContext';

const MainContentContainer = styled.main`
  min-height: 100vh;
  padding-top: 70px;
`;

export default () => {
  return (
    <BrowserRouter>
      <Navbar />
      <MainContentContainer>
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='index' element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route
            path='favorites'
            element={
              <FavoritesProvider>
                <Favorites />
              </FavoritesProvider>
            }
          />
          <Route path='saved' to='favorites' />
          <Route path='lists' to='favorites' />
          <Route
            path='feed'
            element={
              <FavoritesProvider>
                <VodsProvider>
                  <Feed />
                </VodsProvider>
              </FavoritesProvider>
            }
          />
          <Route
            path='live'
            element={
              <FeedsCenterContainer forceMountTwitch={true}>
                <VodsProvider>
                  <Twitch in={true} />
                </VodsProvider>
              </FeedsCenterContainer>
            }
          />
          <Route path='twitch' to='live' />
          <Route
            path='vods'
            element={
              <FeedsCenterContainer>
                <FavoritesProvider>
                  <VodsProvider>
                    <TwitchVods />
                  </VodsProvider>
                </FavoritesProvider>
              </FeedsCenterContainer>
            }
          />
          <Route
            path='twitter'
            element={
              <FeedsCenterContainer>
                <Twitter in={true} />
              </FeedsCenterContainer>
            }
          />

          <Route
            path='youtube'
            element={
              <FeedsCenterContainer>
                <FavoritesProvider>
                  <Youtube />
                </FavoritesProvider>
              </FeedsCenterContainer>
            }
          />
          <Route path='auth/youtube' element={<YoutubeAuth />} />
          <Route path='auth/twitch' element={<TwitchAuth />} />
          <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
          <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
          <Route path='legality' element={<Legality />} />
          <Route path='privacy' element={<Legality />} />
          <Route
            path='youtube/:videoId'
            element={
              <FavoritesProvider>
                <YoutubeVideoPlayer />
              </FavoritesProvider>
            }
          />

          <Route path='category' element={<TopStreams />} />
          <Navigate path='game' to='/category' />
          <Navigate path='top' to='/category' />
          <Route path='category/:category' element={<TopStreams />} />
          <Route path='game/:category' element={<TopStreams />} />
          <Route path='top/:category' element={<TopStreams />} />

          <Route
            path='videos/:videoId'
            element={
              <FavoritesProvider>
                <VideoPlayer />
              </FavoritesProvider>
            }
          />
          <Route path=':channelName/*' element={<TwitchChannelRoutes />} />
        </Routes>
      </MainContentContainer>
      <Footer />
    </BrowserRouter>
  );
};
