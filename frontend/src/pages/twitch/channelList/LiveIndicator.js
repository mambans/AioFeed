import React from 'react';
import LiveInfoPopup from './LiveInfoPopup';
import styled from 'styled-components';
import { Tooltip } from 'react-bootstrap';
import ToolTip from '../../../components/tooltip/ToolTip';

const LiveDot = styled.svg`
  position: absolute;
  width: 30px;
  height: 100%;
  transform: translate3d(-15px, -5px, 0);
`;

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
    <div>
      <img src={channel?.profile_image_url} alt='' />
      <LiveDot height='100%' width='30px'>
        <circle cx='5' cy='5' r='5' stroke='white' strokeWidth='0' fill='red' />
      </LiveDot>
    </div>
  </ToolTip>
);
export default LiveIndicator;