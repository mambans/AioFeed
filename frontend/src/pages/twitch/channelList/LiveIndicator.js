import React from 'react';
import LiveInfoPopup from './LiveInfoPopup';
import styled from 'styled-components';
import { Tooltip } from 'react-bootstrap';
import ToolTip from '../../../components/tooltip/ToolTip';
import { HeartBeat } from '../../../components/HeartBeat';

export const StyledToolTip = styled(Tooltip)`
  &&& {
    font-weight: bold;
    margin-right: 15px;
    padding: 0;
    opacity: 1;
  }

  .arrow,
  .tooltip-arrow {
    &&& {
      transform: translate3d(6px, 18px, 0);
    }
  }
  .tooltip-inner {
    padding: 0;
    border-radius: 10px;
  }
`;

const LiveIndicator = ({ channel }) => (
  <ToolTip
    placement={'left'}
    tooltip={
      <StyledToolTip id={`tooltip-${'left'}`}>
        <LiveInfoPopup channel={channel} />
      </StyledToolTip>
    }
  >
    <>
      <img src={channel?.profile_image_url} alt='' />
      <HeartBeat scaleRings={true} scale={1.5} />
    </>
  </ToolTip>
);
export default LiveIndicator;
