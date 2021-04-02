import React from 'react';

import AllFiltersList from '../CustomFilters/AllFiltersList';
import Header from './../../sharedComponents/Header';
import ChannelSearchList from './../channelList';

export default ({ data, setOrder }) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh } = data;

  return (
    <Header
      id='TwitchHeader'
      text={
        <>
          Twitch <span id='live-indicator'>Live</span>
        </>
      }
      onHoverIconLink='live'
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refreshFunc={() => refresh({ forceRefreshThumbnails: true, forceValidateToken: true })}
      rightSide={
        <>
          <AllFiltersList />
          <ChannelSearchList placeholder='...' />
        </>
      }
      setOrder={setOrder}
      feedName='Twitch'
    />
  );
};
