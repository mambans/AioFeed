import React from 'react';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';

import Header, { HeaderNumberCount } from '../../../components/Header';
import BigScheduleList from './BigScheduleList';
import Colors from '../../../components/themes/Colors';
import ChannelSearchBar from '../searchbars/ChannelSearchBar';

const TwitchHeader = React.forwardRef(({ data, toggleExpanded, collapsed, idTitle }, ref) => {
  const {
    refreshing,
    autoRefreshEnabled,
    refreshTimer,
    refresh,
    followedChannels,
    nonFeedSectionLiveStreams,
  } = data;

  return (
    <Header
      id='TwitchHeader'
      title={
        <h1 id={'twitch'} onClick={toggleExpanded}>
          Twitch
          <span
            style={{
              background: Colors.red,
              fontWeight: 'bold',
              borderRadius: '5px',
              fontSize: '0.9em',
              padding: '0px 3px',
              marginLeft: '5px',
            }}
          >
            Live
          </span>
          <HeaderNumberCount text={nonFeedSectionLiveStreams?.length} />
          <ExpandCollapseFeedButton collapsed={collapsed} />
        </h1>
      }
      ref={ref}
      refreshTimer={refreshTimer}
      autoRefreshEnabled={autoRefreshEnabled}
      isLoading={refreshing}
      refresh={() => refresh()}
      rightSide={
        <>
          <BigScheduleList followedChannels={followedChannels} />
          {/* <ChannelSearchList placeholder='...' /> */}
          <ChannelSearchBar />
        </>
      }
    />
  );
});
export default TwitchHeader;
