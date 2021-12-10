import React from 'react';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';

import AllFiltersList from '../CustomFilters/AllFiltersList';
import Header from './../../sharedComponents/Header';
import ChannelSearchList from './../channelList';
import BigScheduleList from './BigScheduleList';

const TwitchHeader = React.forwardRef(({ data, toggleExpanded, collapsed }, ref) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh, followedChannels } = data;

  return (
    <Header
      id='TwitchHeader'
      title={'Twitch'}
      text={
        <h5 onClick={toggleExpanded}>
          Twitch <span id='live-indicator'>Live</span>
          <ExpandCollapseFeedButton collapsed={collapsed} />
        </h5>
      }
      ref={ref}
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
    />
  );
});
export default TwitchHeader;
