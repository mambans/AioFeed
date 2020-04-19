import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AccountProvider } from "./../account/AccountContext";
import Feed from "../feed";
import { FeedsProvider } from "./../feed/FeedsContext";
import Footer from "../footer";
import Home from "../home";
import Legality from "../legality";
import Navbar from "../navigation";
import { NavigationProvider } from "./../navigation/NavigationContext";
import { NotificationsProvider } from "./../notifications/NotificationsContext";
import Player from "./../twitch/player/Player";
import style from "./Routes.module.scss";
import TopStreams from "../twitch/categoryTopStreams";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import YoutubeAuth from "../auth/YoutubeAuth";
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";
import TwitchChannelRoutes from "./../twitch/Routes";

export default () => {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <NotificationsProvider>
          <AccountProvider>
            <FeedsProvider>
              <Navbar fixed />
              <main id={style.contentContainer}>
                <Routes>
                  <Route path='' element={<Home />} />
                  <Route path='index' element={<Home />} />
                  <Route path='home' element={<Home />} />
                  <Route path='feed' element={<Feed />} />
                  <Route path='auth/youtube' element={<YoutubeAuth />} />
                  <Route path='auth/twitch' element={<TwitchAuth />} />
                  <Route path='auth/twitch/callback' element={<TwitchAuthCallback />} />
                  <Route path='auth/youtube/callback' element={<YoutubeAuthCallback />} />
                  <Route path='legality' element={<Legality />} />
                  <Route path='privacy' element={<Legality />} />

                  <Route path='category' element={<TopStreams />} />
                  {/* <Route path='game' element={<TopStreams />} />
                  <Route path='top' element={<TopStreams />} /> */}
                  <Navigate path='game' to='/category' />
                  <Navigate path='top' to='/category' />
                  <Route path='category/:category' element={<TopStreams />} />
                  <Route path='game/:category' element={<TopStreams />} />
                  <Route path='top/:category' element={<TopStreams />} />

                  <Route path='video/:videoId' element={<Player />} />
                  <Route path='vod/:videoId' element={<Player />} />
                  <Route path=':channelName/*' element={<TwitchChannelRoutes />} />
                  {/* <Route path='/:channelName' element={<Player />} />
                  <Route path='/:channelName/channel' element={<ChannelPage />} />
                  <Route path='/:channelName/videos' element={<ChannelPage />} />
                  <Route path='/:channelName/clips' element={<ChannelPage />} />
                  <Route path='/:channelName/video/:videoId' element={<Player />} />
                  <Route path='/:channelName/vod/:videoId' element={<Player />} />
                  <Route path='/:channelName/clip/:videoId' element={<PlayerClip />} />
                  <Route element={<NoMatch />} /> */}
                </Routes>
              </main>
              <Footer />
            </FeedsProvider>
          </AccountProvider>
        </NotificationsProvider>
      </NavigationProvider>
    </BrowserRouter>
  );
};
