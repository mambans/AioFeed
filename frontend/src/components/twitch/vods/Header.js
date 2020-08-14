import { MdFormatListBulleted } from 'react-icons/md';
import { MdRefresh } from 'react-icons/md';
import { Spinner } from 'react-bootstrap';
import { MdVideocam } from 'react-icons/md';
import Alert from 'react-bootstrap/Alert';
import Popup from 'reactjs-popup';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  ButtonList,
  HeaderLines,
  HeaderOuterMainContainer,
  HeaderLeftSubcontainer,
} from './../../sharedStyledComponents';
import { LastRefreshText } from './StyledComponents';
import Util from '../../../util/Util';
import VodChannelList from './VodChannelList';

export default React.forwardRef((props, ref) => {
  const { refresh, refreshing, vods, vodError } = props;

  return (
    <HeaderOuterMainContainer>
      <HeaderContainer ref={ref} id='TwitchVodsHeader'>
        <HeaderLeftSubcontainer>
          <RefreshButton
            disabled={refreshing}
            onClick={() => {
              refresh(true);
            }}
          >
            {refreshing ? (
              <div className='SpinnerWrapper'>
                <Spinner
                  animation='border'
                  role='status'
                  variant='light'
                  style={Util.loadingSpinnerSmall}
                />
              </div>
            ) : (
              <MdRefresh size={34} />
            )}
          </RefreshButton>
          <LastRefreshText>{(vods && vods.loaded) || new Date()}</LastRefreshText>
          {vodError && (
            <Alert
              key={vodError}
              style={{
                padding: '5px',
                opacity: '0.8',
                margin: '0',
                position: 'absolute',
                marginLeft: '250px',
                //color: #ffc51c,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid',
                borderRadius: '0',
                fontWeight: 'bold',
                filter: 'brightness(250%)',
              }}
              variant={'warning'}
            >
              {vodError}
            </Alert>
          )}
        </HeaderLeftSubcontainer>

        <Popup
          placeholder='Channel name..'
          arrow={false}
          trigger={
            <div
              style={{
                width: '50px',
                minWidth: '50px',
                marginLeft: '250px',
                justifyContent: 'right',
                display: 'flex',
              }}
            >
              <OverlayTrigger
                key={'left'}
                placement={'left'}
                delay={{ show: 1000, hide: 0 }}
                overlay={
                  <Tooltip id={`tooltip-${'left'}`}>
                    Add/remove Twitch channels to fetch vods from
                  </Tooltip>
                }
              >
                <ButtonList variant='outline-secondary'>
                  <MdFormatListBulleted
                    size={22}
                    style={{
                      height: '22px',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  />
                </ButtonList>
              </OverlayTrigger>
            </div>
          }
          position='left top'
          className='settingsPopup'
        >
          <VodChannelList />
        </Popup>
      </HeaderContainer>
      <HeaderTitle>
        <HeaderLines />
        <h5>
          Twitch vods
          <MdVideocam size={25} style={{ color: '#6f166f' }} />
        </h5>
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
});
