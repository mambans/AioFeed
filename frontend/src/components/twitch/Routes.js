import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import ChannelPage from './../twitch/channelPage';
import NoMatch from '../routes/NoMatch';
import Player from './player/Player';
import VideoPlayer from './player/VideoPlayer';
import PlayerClip from './player/PlayerClip';

export default () => {
  return (
    <Routes>
      <Route path='' element={<Player />} />
      <Route path='channel' element={<ChannelPage />} />
      <Navigate path='clips' to={`../channel`} replace />
      <Navigate path='videos' to='../channel' replace />
      <Navigate path='videos/all' to={`../../channel`} replace />
      <Route path='videos/:videoId' element={<VideoPlayer />} />
      <Route path='vod/:videoId' element={<VideoPlayer />} />
      <Route path='clip/:videoId' element={<PlayerClip />} />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  );
};
