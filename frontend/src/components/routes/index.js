import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Feed from '../feed';
import Footer from '../footer';
import Home from '../home';
import Legality from '../legality';
import Navbar from '../navigation';
import VideoPlayer from './../twitch/player/VideoPlayer';
import style from './Routes.module.scss';
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

export default () => {
  return (
    <BrowserRouter>
      <Navbar fixed />
      <main id={style.contentContainer}>
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='index' element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route
            path='feed'
            element={
              <VodsProvider>
                <Feed />
              </VodsProvider>
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
          <Route
            path='twitch'
            element={
              <FeedsCenterContainer forceMountTwitch={true}>
                <VodsProvider>
                  <Twitch in={true} />
                </VodsProvider>
              </FeedsCenterContainer>
            }
          />
          <Route
            path='vods'
            element={
              <FeedsCenterContainer>
                <VodsProvider>
                  <TwitchVods />
                </VodsProvider>
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
                <Youtube />
              </FeedsCenterContainer>
            }
          />
          <Route path='auth/youtube' element={<YoutubeAuth />} />
          <Route path='auth/twitch' element={<TwitchAuth />} />
          <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
          <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
          <Route path='legality' element={<Legality />} />
          <Route path='privacy' element={<Legality />} />
          <Route path='youtube/:videoId' element={<YoutubeVideoPlayer />} />

          <Route path='category' element={<TopStreams />} />
          <Navigate path='game' to='/category' />
          <Navigate path='top' to='/category' />
          <Route path='category/:category' element={<TopStreams />} />
          <Route path='game/:category' element={<TopStreams />} />
          <Route path='top/:category' element={<TopStreams />} />

          <Route path='videos/:videoId' element={<VideoPlayer />} />
          <Route path='vod/:videoId' element={<VideoPlayer />} />
          <Route path=':channelName/*' element={<TwitchChannelRoutes />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};
