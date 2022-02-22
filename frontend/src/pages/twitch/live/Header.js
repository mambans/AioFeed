import React from 'react';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';

import Header, { HeaderNumberCount } from '../../../components/Header';
import ChannelSearchList from './../channelList';
import BigScheduleList from './BigScheduleList';

const TwitchHeader = React.forwardRef(({ data, toggleExpanded, collapsed, idTitle }, ref) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh, followedChannels, liveStreams } =
    data;

  return (
    <Header
      id='TwitchHeader'
      title={
        <h1 id={'twitch'} onClick={toggleExpanded}>
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
        </h1>
      }
      ref={ref}
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refreshFunc={() => refresh({ forceRefreshThumbnails: true, forceValidateToken: true })}
      rightSide={
        <>
          <BigScheduleList followedChannels={followedChannels} />
          <ChannelSearchList placeholder='...' />
        </>
      }
    />
  );
});
export default TwitchHeader;
