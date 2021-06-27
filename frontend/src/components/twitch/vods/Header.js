import { MdFormatListBulleted } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import Alert from 'react-bootstrap/Alert';
import React from 'react';

import Header from '../../sharedComponents/Header';
import {
  AddToListModalTrigger,
  LastRefreshText,
} from '../../sharedComponents/sharedStyledComponents';
import VodChannelList from './VodChannelList';
import { VodChannelListPopupTrigger } from './StyledComponents';
import Popup from 'reactjs-popup';
import ToolTip from '../../sharedComponents/ToolTip';

const VodsHeader = (props) => {
  const { refresh, refreshing, vods, vodError, setOrder } = props;

  return (
    <Header
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
                <ToolTip
                  placement={'left'}
                  delay={{ show: 1000, hide: 0 }}
                  tooltip={'Add/remove Twitch channels to fetch vods from'}
                >
                  <AddToListModalTrigger variant='outline-secondary'>
                    <MdFormatListBulleted size={22} />
                  </AddToListModalTrigger>
                </ToolTip>
              </VodChannelListPopupTrigger>
            }
            position='left top'
          >
            <VodChannelList />
          </Popup>
        </>
      }
      setOrder={setOrder}
      feedName='Twitch'
    />
  );
};
export default VodsHeader;
