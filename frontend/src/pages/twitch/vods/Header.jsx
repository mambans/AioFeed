import { MdVideocam } from 'react-icons/md';
import Alert from 'react-bootstrap/Alert';
import React from 'react';

import Header from '../../../components/Header';
import {
  ExpandCollapseFeedButton,
  LastRefreshText,
} from '../../sharedComponents/sharedStyledComponents';
// import VodChannelList from './VodChannelList';

const VodsHeader = React.forwardRef((props, ref) => {
  const { refresh, vods, vodError, toggleExpanded, collapsed } = props;

  return (
    <Header
      id='TwitchVodsHeader'
      refresh={refresh}
      ref={ref}
      title={
        <h1 id='vods' onClick={toggleExpanded}>
          Twitch vods
          <MdVideocam size={25} style={{ color: '#6f166f' }} />
          <ExpandCollapseFeedButton collapsed={collapsed} />
        </h1>
      }
      leftSide={
        <>
          <LastRefreshText>{(vods && vods.loaded) || new Date()}</LastRefreshText>

          {vodError && typeof vodError === 'string' && (
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
      // rightSide={<VodChannelList />}
    />
  );
});
export default VodsHeader;
