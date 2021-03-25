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

/**
 * Add tooltip on hover\
 *
 * @param {Element} children - Html elements children
 * @param {Boolean} [show = True] - Boolean to enable on hover tooltip
 * @param {Text} [tooltip = ''] - Tooltip text
 * @param {Text} [placement='bottom'] - HTML element(s) to as trigger for 'on hover'.
 * @param {Object} [delay = { show: 250, hide: 0 }] - Object '{ show: 250, hide: 0 }' for tooltip delays
 * @param {Text} [fontSize='14px'] - Font size for tooltip
 */

export default ({
  children,
  show = true,
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
