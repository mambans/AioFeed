import { MdRefresh } from 'react-icons/md';
import { Spinner } from 'react-bootstrap';
import React from 'react';

import {
  RefreshButton,
  HeaderTitle,
  HeaderLines,
  HeaderOuterMainContainer,
  HeaderContainer,
  HeaderLeftSubcontainer,
} from './../../sharedStyledComponents';
import ChannelSearchList from './../channelList';
import CountdownCircleTimer from './CountdownCircleTimer';
import Util from '../../../util/Util';

export default ({ data }) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, refresh } = data;

  return (
    <HeaderOuterMainContainer>
      <HeaderContainer id='TwitchHeader'>
        <HeaderLeftSubcontainer>
          <RefreshButton disabled={refreshing} onClick={refresh}>
            {refreshing ? (
              <div className='SpinnerWrapper'>
                <Spinner
                  animation='border'
                  role='status'
                  variant='light'
                  style={Util.loadingSpinnerSmall}
                />
              </div>
            ) : autoRefreshEnabled ? (
              <CountdownCircleTimer
                key={refreshTimer}
                startDuration={parseFloat(((refreshTimer - Date.now()) / 1000).toFixed(0))}
                duration={25}
              />
            ) : (
              <MdRefresh size={34} />
            )}
          </RefreshButton>
        </HeaderLeftSubcontainer>
        <ChannelSearchList placeholder='...' />
      </HeaderContainer>
      <HeaderTitle>
        <HeaderLines />
        <h5>
          Twitch
          <span id='live-indicator'>Live</span>
        </h5>
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
};
