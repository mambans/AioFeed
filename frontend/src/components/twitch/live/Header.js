import React from 'react';

import AllFiltersList from '../CustomFilters/AllFiltersList';
import Header from './../../sharedComponents/Header';
import ChannelSearchList from './../channelList';
import BigScheduleList from './BigScheduleList';

const TwitchHeader = React.forwardRef(({ data, setOrder }, ref) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh, followedChannels } = data;

  return (
    <Header
      id='TwitchHeader'
      text={
        <>
          Twitch <span id='live-indicator'>Live</span>
        </>
      }
      ref={ref}
      onHoverIconLink='live'
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refreshFunc={() => refresh({ forceRefreshThumbnails: true, forceValidateToken: true })}
      rightSide={
        <>
          <BigScheduleList followedChannels={followedChannels} />
          <AllFiltersList />
          <ChannelSearchList placeholder='...' />
        </>
      }
      setOrder={setOrder}
      feedName='Twitch'
    />
  );
});
export default TwitchHeader;
