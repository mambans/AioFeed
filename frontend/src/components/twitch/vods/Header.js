import { MdFormatListBulleted } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import Alert from 'react-bootstrap/Alert';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { HeaderContainer, ButtonList, LastRefreshText } from './../../sharedStyledComponents';
import ReOrderButtons from './../../ReOrderButtons';

import VodChannelList from './VodChannelList';
import { VodChannelListPopupTrigger } from './StyledComponents';
import Popup from 'reactjs-popup';

export default (props) => {
  const { refresh, refreshing, vods, vodError, setOrder } = props;

  return (
    <HeaderContainer
      id='TwitchVodsHeader'
      refreshFunc={() => refresh(true)}
      isLoading={refreshing}
      text={
        <>
          Twitch vods
          <MdVideocam size={25} style={{ color: '#6f166f' }} />
        </>
      }
      onHoverIconLink='vods'
      leftSide={
        <>
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
        </>
      }
      rightSide={
        <>
          <Popup
            placeholder='Channel name..'
            arrow={false}
            trigger={
              <VodChannelListPopupTrigger>
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
                    <MdFormatListBulleted size={22} />
                  </ButtonList>
                </OverlayTrigger>
              </VodChannelListPopupTrigger>
            }
            position='left top'
          >
            <VodChannelList />
          </Popup>
          <ReOrderButtons setOrder={setOrder} feedName='Vods' />
        </>
      }
    ></HeaderContainer>
  );
};
