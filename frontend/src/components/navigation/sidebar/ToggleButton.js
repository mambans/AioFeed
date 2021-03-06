import React, { useState, useRef, useContext } from 'react';

import { StyledToggleButton } from './StyledComponents';
import ToolTip from '../../sharedComponents/ToolTip';
import AccountContext from '../../account/AccountContext';
import API from '../API';

const ToggleButton = ({
  setEnable,
  enabled,
  label,
  tokenExists,
  tooltip,
  icon,
  buttonsperrow,
  scrollIntoView,
  smallerIcons,
  serviceName,
}) => {
  const [checked, setChecked] = useState(enabled || false);
  const timeout = useRef();
  const { twitchToken, youtubeToken } = useContext(AccountContext);

  const tokensForDomains = {
    Twitch: twitchToken,
    Youtube: youtubeToken,
    Favorites: twitchToken || youtubeToken,
  };

  const anTokenExists = Boolean(tokenExists || tokensForDomains[serviceName]);

  function handleChange() {
    setEnable(!checked);
    setChecked(!checked);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      await API.softUpdateAccount(`${serviceName}Preferences`, { Enabled: !checked });
    }, 2500);

    if (scrollIntoView && !checked === true) {
      setTimeout(() => {
        const element = document.getElementById(`${label || serviceName}Header`);
        element &&
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }
  }

  return (
    <ToolTip tooltip={tooltip} width='max-content'>
      <StyledToggleButton
        onClick={handleChange}
        disabled={!anTokenExists}
        variant='dark'
        buttonsperrow={buttonsperrow}
        enabled={String(checked)}
      >
        {icon}
        {React.Children?.map(smallerIcons, (icon) =>
          React.isValidElement(icon) ? React.cloneElement(icon, { className: 'smallIcon' }) : icon
        )}
      </StyledToggleButton>
    </ToolTip>
  );
};

export default ToggleButton;
