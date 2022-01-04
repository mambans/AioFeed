import React, { useState, useRef, useContext } from 'react';

import { StyledToggleButton } from './StyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';

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
  const { twitchAccessToken } = useContext(TwitchContext);
  const { youtubeAccessToken } = useContext(YoutubeContext);

  const tokensForDomains = {
    Twitch: twitchAccessToken,
    Youtube: youtubeAccessToken,
    MyLists: twitchAccessToken || youtubeAccessToken,
  };

  const anTokenExists = Boolean(tokenExists || tokensForDomains[serviceName]);

  function handleChange() {
    setEnable(!checked);
    setChecked(!checked);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      // save enabled state in database?
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
        disabled={!anTokenExists && !checked}
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