import { FaYoutube } from 'react-icons/fa';
import React from 'react';

import Header from '../../components/Header';
import {
  ExpandCollapseFeedButton,
  LastRefreshText,
} from './../sharedComponents/sharedStyledComponents';
import ReAuthenticateButton from '../navigation/sidebar/ReAuthenticateButton';
import ChannelList from './channelList';
import { HeaderAlert } from './StyledComponents';

const SubFeedError = (props) => {
  const { error } = props;
  let alertError;
  let alertVariant;

  if (error && error.code) {
    switch (error.code) {
      case 401:
        alertError =
          error.errors[0].reason + ' - Authendication expired and only cache used instead.';
        alertVariant = 'danger';
        break;
      case 403:
        alertError = error.errors[0].reason + ' - Only cache used instead.';
        alertVariant = 'warning';
        break;
      default:
        alertError = error.errors[0].reason;
        alertVariant = 'warning';
        break;
    }

    return (
      <>
        <HeaderAlert key={error.errors[0].reason} variant={alertVariant || 'warning'}>
          {alertError}
          {error.code === 401 && (
            <ReAuthenticateButton
              serviceName={'Youtube'}
              style={{ marginLeft: '15px', display: 'inline-block' }}
            />
          )}
        </HeaderAlert>
      </>
    );
  } else {
    return '';
  }
};

const YouTubeHeader = (data) => {
  const {
    refresh,
    requestError,
    followedChannels,
    videos,
    isLoaded,
    setVideos,
    toggleExpanded,
    collapsed,
  } = data;
  return (
    <Header
      id='YoutubeHeader'
      title={
        <h1 id='youtube' onClick={toggleExpanded}>
          YouTube
          <FaYoutube size={25} style={{ color: '#a80000' }} />
          <ExpandCollapseFeedButton collapsed={collapsed} />
        </h1>
      }
      refreshFunc={refresh}
      isLoading={!isLoaded}
      leftSide={
        <>
          <LastRefreshText key={isLoaded || Date.now()}>{isLoaded || Date.now()}</LastRefreshText>
          <SubFeedError error={requestError}></SubFeedError>
        </>
      }
      rightSide={
        <>
          <ChannelList followedChannels={followedChannels} videos={videos} setVideos={setVideos} />
        </>
      }
    />
  );
};

export default YouTubeHeader;
