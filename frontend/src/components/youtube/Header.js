import { FaYoutube } from 'react-icons/fa';
import Alert from 'react-bootstrap/Alert';
import Moment from 'react-moment';
import React from 'react';

import styles from './Youtube.module.scss';
import { HeaderContainer } from './../sharedStyledComponents';
import ReAuthenticateButton from '../navigation/sidebar/ReAuthenticateButton';
import ChannelList from './channelList';

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
        <Alert
          key={error.errors[0].reason}
          className={styles.requestError}
          variant={alertVariant || 'warning'}
        >
          {alertError}
          {error.code === 401 && (
            <ReAuthenticateButton
              serviceName={'Youtube'}
              style={{ marginLeft: '15px', display: 'inline-block' }}
            />
          )}
        </Alert>
      </>
    );
  } else {
    return '';
  }
};

export default (data) => {
  const { refresh, requestError, followedChannels, videos, isLoaded, setVideos } = data;
  return (
    <HeaderContainer
      id='YoutubeHeader'
      text={
        <>
          Youtube
          <FaYoutube size={25} style={{ color: '#a80000' }} />
        </>
      }
      refreshFunc={refresh}
      isLoading={!isLoaded}
      leftSide={
        <>
          <Moment key={isLoaded || Date.now()} className={styles.lastRefresh} fromNow>
            {isLoaded || Date.now()}
          </Moment>
          <SubFeedError error={requestError}></SubFeedError>
        </>
      }
      rightSide={
        <ChannelList followedChannels={followedChannels} videos={videos} setVideos={setVideos} />
      }
    ></HeaderContainer>
  );
};
