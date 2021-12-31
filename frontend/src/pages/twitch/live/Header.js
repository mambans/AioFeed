import React from 'react';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';

import AllFiltersList from '../CustomFilters/AllFiltersList';
import Header, { HeaderNumberCount } from '../../../components/Header';
import ChannelSearchList from './../channelList';
import BigScheduleList from './BigScheduleList';

const TwitchHeader = React.forwardRef(({ data, toggleExpanded, collapsed }, ref) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh, followedChannels, liveStreams } =
    data;

  return (
    <Header
      id='TwitchHeader'
      title={
        <h5 onClick={toggleExpanded}>
          Twitch
          <span
            style={{
              background: 'rgb(202, 35, 43)',
              fontWeight: 'bold',
              borderRadius: '5px',
              fontSize: '0.9em',
              padding: '0px 3px',
              marginLeft: '5px',
            }}
          >
            Live
          </span>
          <HeaderNumberCount text={liveStreams?.length} />
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
