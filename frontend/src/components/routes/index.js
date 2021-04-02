import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Feed from '../feed';
import Footer from '../footer';
import Home from '../home';
import Legality from '../legality';
import Navbar from '../navigation';
// import VideoPlayer from './../twitch/player/VideoPlayer';
import TopStreams from '../twitch/categoryTopStreams';
import TwitchAuthCallback from '../auth/TwitchAuthCallback';
import TwitchChannelRoutes from './../twitch/Routes';
import YoutubeAuthCallback from '../auth/YoutubeAuthCallback';
// import YoutubeVideoPlayer from './../youtube/YoutubeVideoPlayer';
import Twitch from '../twitch/live';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import Youtube from './../youtube';
import Favorites from '../favorites';
import SharedVideoPlayer from '../sharedComponents/SharedVideoPlayer';

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
          <Route path='favorites' element={<Favorites />} />
          <Route path='saved' to='favorites' />
          <Route path='lists' to='favorites' />
          <Route path='feed' element={<Feed />} />
          <Route path='live' element={<Twitch forceMountTwitch={true} />} />
          <Route path='twitch' to='live' />
          <Route path='vods' element={<TwitchVods />} />
          <Route path='twitter' element={<Twitter />} />

          <Route path='youtube' element={<Youtube />} />
          <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
          <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
          <Route path='legality' element={<Legality />} />
          <Route path='privacy' element={<Legality />} />
          {/* <Route path='youtube/:videoId' element={<YoutubeVideoPlayer />} /> */}
          {/* <Route
            path='youtube/:videoId'
            element={
              <SharedVideoPlayer>
                <YoutubeVideoPlayer />
              </SharedVideoPlayer>
            }
          /> */}
          <Route path='youtube/:videoId' element={<SharedVideoPlayer />} />

          <Route path='category' element={<TopStreams />} />
          <Navigate path='game' to='/category' />
          <Navigate path='top' to='/category' />
          <Route path='category/:category' element={<TopStreams />} />
          <Route path='game/:category' element={<TopStreams />} />
          <Route path='top/:category' element={<TopStreams />} />

          {/* <Route path='videos/:videoId' element={<VideoPlayer />} /> */}
          {/* <Route
            path='videos/:videoId'
            element={
              <SharedVideoPlayer>
                <VideoPlayer />
              </SharedVideoPlayer>
            }
          /> */}
          <Route path='videos/:videoId' element={<SharedVideoPlayer />} />
          <Route path=':channelName/*' element={<TwitchChannelRoutes />} />
        </Routes>
      </MainContentContainer>
      <Footer />
    </BrowserRouter>
  );
};
