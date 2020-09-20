import React, { useState, useRef } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { StyledToggleButton } from './StyledComponent';
import { AddCookie, getCookie } from '../../../util/Utils';
import axios from 'axios';

export default ({
  setEnable,
  enabled,
  label,
  tokenExists,
  tooltip,
  icon,
  buttonsperrow,
  scrollIntoView,
  smallerIcons,
}) => {
  const [checked, setChecked] = useState(enabled || false);
  const timeout = useRef();

  function handleChange() {
    setEnable(!checked);
    setChecked(!checked);
    AddCookie(`${label}_FeedEnabled`, !checked);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/soft-update`, {
          username: getCookie(`AioFeed_AccountName`),
          columnValue: { Enabled: !checked },
          columnName: `${label}Preferences`,
          authkey: getCookie(`AioFeed_AuthKey`),
        })
        .catch((e) => {
          console.error(e);
        });
    }, 2500);

    if (scrollIntoView && !checked === true) {
      window.setTimeout(() => {
        const element = document.getElementById(`${label}Header`);
        element &&
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }
  }

  return (
    <OverlayTrigger
      key={'bottom'}
      placement={'bottom'}
      delay={{ show: 200, hide: 0 }}
      overlay={
        <Tooltip style={{ whiteSpace: 'pre-wrap' }} id={`tooltip-${'bottom'}`}>
          {tooltip}
        </Tooltip>
      }
    >
      <StyledToggleButton
        onClick={handleChange}
        disabled={!tokenExists}
        variant='dark'
        buttonsperrow={buttonsperrow}
        enabled={checked.toString()}
      >
        {icon}
        {React.Children.map(smallerIcons, (icon) =>
          React.isValidElement(icon) ? React.cloneElement(icon, { className: 'smallIcon' }) : icon
        )}
      </StyledToggleButton>
    </OverlayTrigger>
  );
};
