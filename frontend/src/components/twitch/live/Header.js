import React from 'react';

import { HeaderContainer } from './../../sharedStyledComponents';
import ChannelSearchList from './../channelList';

export default ({ data }) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh } = data;

  return (
    <HeaderContainer
      id='TwitchHeader'
      text={
        <>
          Twitch <span id='live-indicator'>Live</span>
        </>
      }
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refreshFunc={refresh}
      rightSide={<ChannelSearchList placeholder='...' />}
    />
  );
};
