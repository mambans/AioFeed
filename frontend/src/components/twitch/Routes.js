import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import ChannelPage from "./../twitch/channelPage";
import NoMatch from "../routes/NoMatch";
import Player from "./player/Player";
import PlayerClip from "./player/PlayerClip";

export default () => {
  const currentRoute = useLocation().pathname.split("/")[1];
  return (
    <Routes>
      <Route path='' element={<Player />} />
      <Route path='channel' element={<ChannelPage />} />
      <Navigate path='videos' to={`/${currentRoute}/channel`} replace />
      <Navigate path='clips' to={`/${currentRoute}/channel`} replace />
      {/* <Navigate path='videos' to='channel' replace /> */}
      {/* <Route path='videos' element={<Navigate from='videos' to={`channel`} replace />} /> */}
      {/* <Route path='videos' element={<Navigate to={`/${currentRoute}/channel`} replace />} /> */}
      {/* <Route path='videos' element={<ChannelPage />} /> */}
      {/* <Route path='clips' element={<ChannelPage />} /> */}
      <Route path='videos/:videoId' element={<Player />} />
      <Route path='vod/:videoId' element={<Player />} />
      <Route path='clip/:videoId' element={<PlayerClip />} />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  );
};
