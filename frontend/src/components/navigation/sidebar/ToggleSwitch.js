import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./StyledComponent";

export default ({ setEnable, enabled, label, tokenExists }) => {
  const [checked, setChecked] = useState(enabled || false);

  function handleChange(checked) {
    setEnable(checked);
    setChecked(checked);
    document.cookie = `${label}_FeedEnabled=${checked}; path=/`;
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + ` ${label} feed`}>
      <Switch
        disabled={!tokenExists}
        onChange={handleChange}
        checked={(tokenExists && checked) || false}
      />
      <span>{label}</span>
    </StyledToggleSwitch>
  );
};
