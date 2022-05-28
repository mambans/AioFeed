import React, { useRef, useContext, useEffect } from 'react';

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
  disabled,
}) => {
  // const [checked, setChecked] = useState(enabled || false);
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
    const newEnabled = !enabled;
    setEnable(newEnabled);
    clearTimeout(timeout.current);
    if (scrollIntoView && newEnabled === true) {
      timeout.current = setTimeout(() => {
        const element = document.getElementById(`${label || serviceName}Header`);
        element &&
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 150);
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <ToolTip tooltip={tooltip} width='max-content'>
      <StyledToggleButton
        onClick={handleChange}
        disabled={disabled ?? !anTokenExists}
        variant='dark'
        buttonsperrow={buttonsperrow}
        enabled={String(enabled)}
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
