import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';

import ChannelPage from './../twitch/channelPage';
import NoMatch from '../routes/NoMatch';
import Player from './player/Player';
// import VideoPlayer from './player/VideoPlayer';
import PlayerClip from './player/PlayerClip';
import SharedVideoPlayer from '../sharedComponents/SharedVideoPlayer';

const TwitchRoutes = () => {
  const channelName = useParams()?.channelName;

  return (
    <Routes>
      <Route path='' element={<Player />} />

      <Route path='page' element={<ChannelPage />} />
      <Navigate path='channel' to='../page' replace />
      <Navigate path='channelpage' to='../page' replace />
      <Navigate path='clips' to={`../page`} replace />
      <Navigate path='videos' to='../page' replace />
      <Navigate path='videos/all' to={`../../page`} replace />

      <Route path='videos/:videoId' element={<SharedVideoPlayer channelNameAttr={channelName} />} />
      <Route path='clip/:videoId' element={<PlayerClip />} />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  );
};
export default TwitchRoutes;
