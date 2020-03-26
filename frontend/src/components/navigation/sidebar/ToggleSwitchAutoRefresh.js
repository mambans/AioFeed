import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./StyledComponent";

export default ({ autoRefreshEnabled, setAutoRefreshEnabled, tokenExists }) => {
  const [checked, setChecked] = useState(autoRefreshEnabled);

  function handleChange(checked) {
    setChecked(checked);
    setAutoRefreshEnabled(checked);
    document.cookie = `Twitch_AutoRefresh=${checked}; path=/`;
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + "Twitch auto refresh"}>
      <Switch onChange={handleChange} checked={checked} disabled={!tokenExists} />
      <span>Auto refresh streams (25s)</span>
    </StyledToggleSwitch>
  );
};
