import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

const ToolTipText = styled(Tooltip)`
  width: 336px;
  &&& {
    .tooltip-inner {
      font-size: ${({ fontSize }) => fontSize};
    }
  }
`;

export default ({
  children,
  show,
  tooltip = '',
  placement = 'bottom',
  delay = { show: 250, hide: 0 },
  fontSize = '14px',
}) => {
  if (show)
    return (
      <OverlayTrigger
        key={tooltip + Date.now()}
        placement={placement}
        delay={delay}
        overlay={
          <ToolTipText fontSize={fontSize} id={`tooltip-${'bottom'}`}>
            {tooltip}
          </ToolTipText>
        }
      >
        {children}
      </OverlayTrigger>
    );

  return children;
};
